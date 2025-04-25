import { create } from "zustand";
import { Mensaje } from "../types/mensaje";

type EstadoChat = {
    messages: Mensaje[];
    carrito: number[];
    agregarMensaje: (mensaje: Mensaje) => void;
    agregarAlCarrito: (productoId: number) => void;
    removerDelCarrito: (productoId: number) => void;
    vaciarCarrito: () => void;
}

export const useChatStore = create<EstadoChat>((set) => ({
    messages: [
        {
            id: 1,
            rol: "bot",
            texto: "¡Hola! Soy tu asistente de ventas. ¿Buscas algún producto en particular?",
        },
    ],
    carrito: [],
    agregarMensaje: (mensaje) => 
        set((state) => ({ 
            messages: [...state.messages, mensaje] 
        })),
    agregarAlCarrito: (productoId) => 
        set((state) => ({ 
            carrito: [...state.carrito, productoId] 
        })),
    removerDelCarrito: (productoId) => 
        set((state) => ({ 
            carrito: state.carrito.filter(id => id !== productoId) 
        })),
    vaciarCarrito: () => 
        set({ carrito: [] }),
}));