

export type Rol = "usuario" | "bot" | "asistente" | "sistema";

export type Mensaje = {
    id: number;
    rol: Rol;
    texto: string;

}