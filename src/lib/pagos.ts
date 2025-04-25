import { productos } from "./productos";

type MetodoPago = 'tarjeta' | 'paypal' | 'transferencia';

interface MetodoPagoInfo {
    id: MetodoPago;
    nombre: string;
    icono: string;
    instrucciones: string;
}

export const metodosPagoDisponibles: MetodoPagoInfo[] = [
    { 
        id: 'tarjeta', 
        nombre: 'Tarjeta de crédito/débito', 
        icono: '💳',
        instrucciones: 'Ingresa los datos de tu tarjeta en nuestro procesador seguro (Stripe).' 
    },
    { 
        id: 'paypal', 
        nombre: 'PayPal', 
        icono: '🔵',
        instrucciones: 'Serás redirigido a PayPal para autorizar el pago.' 
    },
    { 
        id: 'transferencia', 
        nombre: 'Transferencia bancaria', 
        icono: '🏦',
        instrucciones: 'Te proporcionaremos los datos bancarios para realizar la transferencia.' 
    }
];

export const iniciarPago = (productosIds: number[], metodo: MetodoPago): string => {
    const productosCompra = productosIds.map(id => 
        productos.find(p => p.id === id)
    ).filter(Boolean) as typeof productos;
    
    if (productosCompra.length === 0) {
        return "⚠️ Error: No se encontraron los productos seleccionados.";
    }

    const total = productosCompra.reduce((sum, p) => sum + p.precio, 0);
    const metodoInfo = metodosPagoDisponibles.find(m => m.id === metodo);

    return `✅ Pedido confirmado!\n\n📦 Productos:\n${
        productosCompra.map(p => `- ${p.nombre} ($${p.precio})`).join('\n')
    }\n\n💵 Total: $${total.toFixed(2)}\n\n💳 Método de pago: ${metodoInfo?.nombre} ${
        metodoInfo?.icono
    }\n\n${metodoInfo?.instrucciones}\n\n¿Deseas proceder con el pago ahora? (Sí/No)`;
};

export const procesarPago = (metodo: MetodoPago): string => {
    const metodoInfo = metodosPagoDisponibles.find(m => m.id === metodo);
    
    return `🔄 Procesando pago con ${metodoInfo?.nombre}...\n\n${
        metodoInfo?.instrucciones
    }\n\nUna vez completado el pago, recibirás un correo de confirmación con los detalles de tu compra.`;
};

export const manejarMetodoPago = (): string => {
    return `💳 Selecciona un método de pago seguro:\n\n${
        metodosPagoDisponibles.map(m => `${m.icono} ${m.nombre}`).join('\n')
    }\n\nResponde con el nombre del método que prefieras.`;
};