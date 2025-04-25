export type Producto = {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    categoria: string;
    stock: number;
    enOferta?: boolean;
};

export const productos: Producto[] = [
    {
        id: 1,
        nombre: "Laptop ASUS ROG Strix",
        precio: 1499,
        descripcion: "Laptop gamer con procesador i7, 16GB RAM, RTX 3060",
        categoria: "electrónica",
        stock: 15
    },
    {
        id: 2,
        nombre: "iPhone 15 Pro",
        precio: 999,
        descripcion: "Smartphone Apple con chip A17 Pro, 128GB almacenamiento",
        categoria: "electrónica",
        stock: 30,
        enOferta: true
    },
    {
        id: 3,
        nombre: "Beats Powerbeats Pro",
        precio: 200,
        descripcion: "Audífonos inalámbricos para deporte",
        categoria: "audio",
        stock: 25
    },
    {
        id: 4,
        nombre: "JBL Reflect Flow Pro",
        precio: 149,
        descripcion: "Audífonos deportivos con cancelación de ruido",
        categoria: "audio",
        stock: 18,
        enOferta: true
    },
    {
        id: 5,
        nombre: "Samsung Galaxy S23 Ultra",
        precio: 1199,
        descripcion: "Smartphone con cámara de 200MP y S Pen incluido",
        categoria: "electrónica",
        stock: 22
    },
    {
        id: 6,
        nombre: "MacBook Air M2",
        precio: 1299,
        descripcion: "Laptop ultradelgada con chip Apple M2 y pantalla Retina",
        categoria: "electrónica",
        stock: 12,
        enOferta: true
    },
    {
        id: 7,
        nombre: "Sony WH-1000XM5",
        precio: 349,
        descripcion: "Audífonos over-ear con cancelación de ruido líder",
        categoria: "audio",
        stock: 8
    },
    {
        id: 8,
        nombre: "Apple Watch Series 9",
        precio: 399,
        descripcion: "Smartwatch con monitor de salud avanzado",
        categoria: "wearables",
        stock: 20
    },
    {
        id: 9,
        nombre: "Dell XPS 15",
        precio: 1799,
        descripcion: "Laptop premium con pantalla 4K y procesador i9",
        categoria: "electrónica",
        stock: 10,
        enOferta: true
    },
    {
        id: 10,
        nombre: "Bose QuietComfort 45",
        precio: 279,
        descripcion: "Audífonos con cancelación de ruido y sonido premium",
        categoria: "audio",
        stock: 15
    },
    {
        id: 11,
        nombre: "iPad Pro 12.9\"",
        precio: 1099,
        descripcion: "Tablet profesional con pantalla Liquid Retina XDR",
        categoria: "electrónica",
        stock: 18
    },
    {
        id: 12,
        nombre: "Samsung Galaxy Buds2 Pro",
        precio: 229,
        descripcion: "Audífonos inalámbricos con sonido Hi-Fi 24bit",
        categoria: "audio",
        stock: 25,
        enOferta: true
    },
    {
        id: 13,
        nombre: "Google Pixel 7 Pro",
        precio: 899,
        descripcion: "Smartphone con cámara computational de Google",
        categoria: "electrónica",
        stock: 14
    },
    {
        id: 14,
        nombre: "Microsoft Surface Laptop 5",
        precio: 1299,
        descripcion: "Laptop elegante con Windows 11 y pantalla táctil",
        categoria: "electrónica",
        stock: 9
    },
    {
        id: 15,
        nombre: "AirPods Pro (2da generación)",
        precio: 249,
        descripcion: "Audífonos con cancelación de ruido adaptativa",
        categoria: "audio",
        stock: 30,
        enOferta: true
    },
    {
        id: 16,
        nombre: "LG OLED C2 55\"",
        precio: 1499,
        descripcion: "TV OLED 4K con procesador α9 Gen 5",
        categoria: "televisores",
        stock: 7
    },
    {
        id: 17,
        nombre: "PlayStation 5",
        precio: 499,
        descripcion: "Consola de última generación con SSD ultrarrápido",
        categoria: "gaming",
        stock: 5,
        enOferta: true
    },
    {
        id: 18,
        nombre: "Xbox Series X",
        precio: 499,
        descripcion: "Consola con 12 teraflops de potencia",
        categoria: "gaming",
        stock: 8
    },
    {
        id: 19,
        nombre: "Nintendo Switch OLED",
        precio: 349,
        descripcion: "Consola híbrida con pantalla OLED de 7 pulgadas",
        categoria: "gaming",
        stock: 12
    },
    {
        id: 20,
        nombre: "Kindle Paperwhite",
        precio: 139,
        descripcion: "E-reader con pantalla antirreflejo y luz cálida",
        categoria: "lectura",
        stock: 20,
        enOferta: true
    }
];

// Obtener categorías únicas
export const obtenerCategorias = (): string[] => {
    return [...new Set(productos.map(p => p.categoria))];
};

// Buscar productos por término
export const buscarProductos = (consulta: string): Producto[] => {
    if (!consulta || consulta.trim().length < 2) return [];
    
    const termino = consulta.toLowerCase();
    return productos.filter(p => 
        p.nombre.toLowerCase().includes(termino) || 
        p.categoria.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
    );
};

// Obtener productos en oferta
export const obtenerOfertas = (): Producto[] => {
    return productos.filter(p => p.enOferta);
};

// Formatear lista de productos para mostrar
export const formatearProductos = (productos: Producto[]): string => {
    if (productos.length === 0) {
        return "No encontré productos que coincidan con tu búsqueda.";
    }

    let respuesta = `🔍 Encontré ${productos.length} producto(s):\n\n`;
    productos.forEach((p, index) => {
        respuesta += `${index + 1}. ${p.nombre}\n   💵 Precio: $${p.precio}${p.enOferta ? ' (¡Oferta!)' : ''}\n   📦 Stock: ${p.stock}\n   📝 ${p.descripcion}\n\n`;
    });

    return respuesta;
};

// Sugerir categorías disponibles
export const sugerirCategorias = (): string => {
    const categorias = obtenerCategorias();
    return `📋 Categorías disponibles:\n\n${
        categorias.map(c => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`).join('\n')
    }\n\n¿Qué categoría te interesa?`;
};