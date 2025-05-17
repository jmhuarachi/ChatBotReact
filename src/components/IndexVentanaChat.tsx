import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { minLength, object, pipe, string } from "valibot";
import { useChatStore } from "../store/useChatStore";
import { useState, useRef, useEffect } from "react";
import { consultarIA } from "../lib/consultarIA";
import { Bot, Send, User, ShoppingCart, Info } from "lucide-react";

const schema = object({
  texto: pipe(
    string(),
    minLength(1, "El mensaje no puede estar vacío")
  )
});

type Formulario = {
  texto: string;
};

export default function IndexVentanaChat() {
  const { messages, agregarMensaje, carrito } = useChatStore();
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Formulario>({
    resolver: valibotResolver(schema),
  });

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, cargando]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatearTexto = (texto: string) => {
    return texto.split('\n').map((linea, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {linea}
      </p>
    ));
  };

  const manejarEnvio = async (entrada: string) => {
    if (!entrada.trim()) return;
    
    agregarMensaje({
      id: Date.now(),
      rol: "usuario",
      texto: entrada,
    });
    
    setCargando(true);
    
    try {
      let respuesta = await consultarIA({
        soloUsuario: entrada,
        incluirHistorial: true
      });
      
      agregarMensaje({
        id: Date.now() + 1,
        rol: "bot",
        texto: respuesta,
      });
    } catch (error) {
      console.error("Error:", error);
      agregarMensaje({
        id: Date.now() + 1,
        rol: "bot",
        texto: "⚠️ Lo siento, ocurrió un error. Por favor intenta:\n\n1. Reformular tu pregunta\n2. Preguntar por 'categorías'\n3. Intentar más tarde",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
        <header className="bg-gray-800/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Asistente de Ventas
            </h1>
          </div>
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition relative"
            onClick={() => manejarEnvio("Ver mi carrito")}
          >
            <ShoppingCart className="h-5 w-5 text-blue-400" />
            {carrito.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {carrito.length}
              </span>
            )}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !cargando ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot className="h-12 w-12 mb-4" />
              <p className="text-lg">¿Qué producto estás buscando?</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm w-full max-w-xs">
                <button 
                  onClick={() => manejarEnvio("Mostrar electrónica")}
                  className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <span className="mr-2">💻</span> Electrónica
                </button>
                <button 
                  onClick={() => manejarEnvio("Mostrar audio")}
                  className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <span className="mr-2">🎧</span> Audio
                </button>
              </div>
            </div>
          ) : (
            messages.map((mensaje) => (
              <div 
                key={mensaje.id} 
                className={`flex gap-3 ${mensaje.rol === "bot" ? "justify-start" : "justify-end"}`}
              >
                {mensaje.rol === "bot" && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div 
                  className={`max-w-[85%] rounded-xl p-3 ${mensaje.rol === "usuario" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-gray-700 text-white rounded-bl-none"}`}
                >
                  {formatearTexto(mensaje.texto)}
                </div>
                {mensaje.rol === "usuario" && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
            ))
          )}

          {cargando && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-700 text-white rounded-xl rounded-bl-none p-3 max-w-[85%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={mensajesEndRef} />
        </main>

        <footer className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
          <form
            onSubmit={handleSubmit(data => {
              manejarEnvio(data.texto);
              reset();
            })}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              {...register("texto")}
              ref={(e) => {
                register("texto").ref(e);
                inputRef.current = e;
              }}
              placeholder="Escribe tu consulta sobre productos..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={cargando}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cargando}
            >
              <Send className="h-5 w-5" />
            </button>
            

          </form>

          <button
            onClick={() => manejarEnvio("Mostrar categorías")}
            className="mt-3 flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Info className="h-4 w-4 mr-2" />
            Explorar categorías disponibles
          </button>

          {errors.texto && (
            <p className="text-red-400 text-sm mt-2 ml-1">{errors.texto.message}</p>
          )}
        </footer>
      </div>
    </div>
  );
}