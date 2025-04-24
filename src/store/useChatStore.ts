import { create } from "zustand";
import { Mensaje } from "../types/mensaje";

type EstadoChat = {
    messages: Mensaje[];
    agregarMensaje: (mensaje: Mensaje) => void;
}


export const useChatStore = create<EstadoChat>((set) => ({
    // Estado inicial del chat - IndexVentanaChat.tsx
    messages: [
        {
            id: 1,
            rol: "bot",
            texto: "Hola, soy un bot de IA. ¿En qué puedo ayudarte?",
        },
    ], 
    agregarMensaje: (mensaje) => 
        set((state) => ({ 
            messages: [
                ...state.messages, mensaje
            ] 
        })),

}))