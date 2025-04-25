import axios from "axios";
import { useChatStore } from "../store/useChatStore";
import { buscarProductos, sugerirCategorias, formatearProductos, obtenerOfertas, productos } from "./productos";
import { manejarMetodoPago, iniciarPago, procesarPago } from "./pagos";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const manejarCompra = (productosIds: number[]): string => {
    const productosCompra = productosIds.map(id => 
        productos.find(p => p.id === id)
    ).filter(Boolean) as typeof productos;
    
    if (productosCompra.length === 0) {
        return "No encontré los productos que quieres comprar. ¿Podrías especificar cuáles?";
    }

    return `¡Excelente elección!\n\n📦 Estás a punto de finalizar tu compra de:\n${
        productosCompra.map(p => `- ${p.nombre} ($${p.precio})`).join('\n')
    }\n\n${manejarMetodoPago()}`;
};

const sugerirProductos = (consulta: string): string => {
    const sugerenciasEspeciales: Record<string, () => typeof productos> = {
        "ofertas": () => obtenerOfertas(),
        "nuevos": () => productos.slice(0, 2),
        "populares": () => [productos[1], productos[3]],
        "recomendados": () => [productos[0], productos[2]]
    };

    const terminoSugerido = Object.keys(sugerenciasEspeciales).find(key => 
        consulta.toLowerCase().includes(key)
    );

    if (terminoSugerido) {
        const productosSugeridos = sugerenciasEspeciales[terminoSugerido]();
        if (productosSugeridos.length > 0) {
            return `✨ ${terminoSugerido.charAt(0).toUpperCase() + terminoSugerido.slice(1)}:\n\n` + 
                   formatearProductos(productosSugeridos) +
                   `\n\n¿Te interesa alguno en particular?`;
        }
    }

    return "";
};

const procesarConfirmacionPago = async (): Promise<string> => {
    const historial = useChatStore.getState().messages;
    const ultimoMensajeUsuario = historial.filter(m => m.rol === 'usuario').slice(-2)[0]?.texto.toLowerCase();
    
    let metodo: 'tarjeta' | 'paypal' | 'transferencia' | null = null;
    if (ultimoMensajeUsuario?.includes('tarjeta')) metodo = 'tarjeta';
    else if (ultimoMensajeUsuario?.includes('paypal')) metodo = 'paypal';
    else if (ultimoMensajeUsuario?.includes('transferencia')) metodo = 'transferencia';
    
    if (metodo) {
        // IDs de ejemplo - en producción usaríamos los productos del carrito
        return procesarPago(metodo);
    }
    
    return "No pude identificar tu método de pago. Por favor selecciona uno nuevamente.";
};

export const consultarIA = async ({ 
    soloUsuario, 
    incluirHistorial 
}: { 
    soloUsuario: string, 
    incluirHistorial: boolean 
}): Promise<string> => {
    const textoUsuario = soloUsuario.toLowerCase();

    // Detectar confirmación de pago
    if (textoUsuario.includes('sí') || textoUsuario.includes('si') || textoUsuario.includes('confirmar')) {
        return await procesarConfirmacionPago();
    }

    // Detectar flujo de compra
    if (textoUsuario.includes('comprar') || textoUsuario.includes('pagar')) {
        const productosEncontrados = buscarProductos(textoUsuario);
        if (productosEncontrados.length > 0) {
            return manejarCompra(productosEncontrados.map(p => p.id));
        }
    }

    // Detectar selección de método de pago
    if (textoUsuario.includes('tarjeta') || textoUsuario.includes('paypal') || textoUsuario.includes('transferencia')) {
        const metodo = textoUsuario.includes('tarjeta') ? 'tarjeta' : 
                       textoUsuario.includes('paypal') ? 'paypal' : 'transferencia';
        return iniciarPago([1, 2], metodo); // IDs de ejemplo
    }

    // Buscar productos
    const productosEncontrados = buscarProductos(textoUsuario);
    
    // Si hay productos, mostrarlos
    if (productosEncontrados.length > 0) {
        return formatearProductos(productosEncontrados);
    }

    // Intenta con sugerencias especiales si no hay resultados directos
    const sugerencia = sugerirProductos(textoUsuario);
    if (sugerencia) return sugerencia;

    // Si es consulta de categorías
    if (textoUsuario.includes('categoría') || textoUsuario.includes('productos') || 
        textoUsuario.includes('qué tienen') || textoUsuario.includes('mostrar')) {
        return sugerirCategorias();
    }

    // System prompt
    const sistema = {
        role: "system",
        content: `Eres un asistente de ventas para una tienda online de electrónicos y audio. 
Productos disponibles:
${productos.map(p => `- ${p.nombre} (${p.categoria})`).join('\n')}

Reglas:
1. Solo habla de los productos listados arriba
2. Usa lenguaje claro y amigable
3. No inventes productos
4. Para pagos, guía al usuario paso a paso`
    };

    const historialFormateado = incluirHistorial ? 
        useChatStore.getState().messages.slice(-4).map((mensaje) => ({
            role: mensaje.rol === "usuario" ? "user" : "assistant",
            content: mensaje.texto,
        })) : [];

    try {
        const respuesta = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama3-70b-8192",
            messages: [sistema, ...historialFormateado, { role: "user", content: soloUsuario }],
            max_tokens: 400,
            temperature: 0.5,
            stop: ["\n\n\n"]
        }, {
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        let texto = respuesta.data.choices[0].message.content;
        
        texto = texto.replace(/\*\*/g, '')
                    .replace(/\*/g, '')
                    .replace(/#/g, '')
                    .replace(/\n\s*\n/g, '\n\n');

        return texto || sugerirCategorias();
    } catch (error) {
        console.error("Error al consultar la IA:", error);
        return `⚠️ Estoy teniendo dificultades técnicas. ${sugerirCategorias()}`;
    }
};