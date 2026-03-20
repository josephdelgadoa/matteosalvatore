# Documentación Completa del Proyecto: MatteoSalvatore.pe (2026)

Esta es la documentación oficial definitiva de la plataforma e-commerce de **Matteo Salvatore**, un sistema de lujo minimalista potenciado por Inteligencia Artificial y una arquitectura logística de alto rendimiento.

---

## 1. Visión & Filosofía
**Matteo Salvatore** es una marca de moda masculina premium en Perú que busca redefinir el "Lujo Minimalista". La plataforma digital refleja esta elegancia a través de interfaces limpias, navegación fluida y una experiencia de usuario (UX) centrada en la sofisticación y la eficiencia.

---

## 2. Stack Tecnológico (Elite Tech Stack)
La plataforma utiliza las tecnologías más avanzadas del 2026 para garantizar velocidad, seguridad y escalabilidad:

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Node.js 20+ (Express.js).
- **Base de Datos**: Supabase (PostgreSQL 15) + Redis para caché de alto impacto.
- **Inteligencia Artificial**: Google Gemini 2.5 Flash (Generación de contenido de lujo y SEO).
- **Pagos**: Culqi (Integración nativa con cálculo automático de IGV 18%).
- **Infraestructura**: Docker + Nginx + Let's Encrypt sobre VPS de alto rendimiento.

---

## 3. Sistemas Estratégicos (Core Engines)

### 3.1 Matriz de Códigos de Barras (Logística Elite)
Sistema de identificación único de 11 dígitos que elimina conflictos de inventario:
- **Prefijo de Estilo (8 dígitos)**: Ej. `00501000` (Polo Pima Básico).
- **Identidad de Color (2 dígitos)**: Mapeo oficial de 42 colores (01-42).
- **Identidad de Talla (1 dígito)**: Mapeo estandarizado (0-7).
- **Fórmula**: `[Estilo][Color][Talla]`

### 3.2 Elite AI Marketing Kit
Integración profunda con Gemini para automatizar el contenido de lujo:
- **Generación de Activos**: SEO Meta (títulos/descripciones), Social Media Captions (IG/TikTok), Image/Video Prompts.
- **Resiliencia UX**: Sistema `renderAiValue` que garantiza que el frontend siempre muestre texto limpio, incluso ante respuestas complejas de la IA.

### 3.3 Gestión Avanzada (Admin Experience)
- **Búsqueda Inteligente**: Motor que filtra simultáneamente por Nombre, Categoría y Código de Estilo en tiempo real.
- **Full Reset Control**: Scripts de mantenimiento para limpieza profunda de base de datos (`reset_store.js`) asegurando un "Clean Start" cuando sea necesario.

---

## 4. Diseño & Experiencia (UX/UI)
- **Concepto**: "Minimal Luxury" — Generosos espacios en blanco, tipografía premium (Cormorant Garamond / Outfit).
- **Mobile First**: Optimización total para compras desde smartphones con interfaces táctiles refinadas.
- **Identidad Visual**: Paleta de negros profundos, blancos perla y acentos en cuero/oro.

---

## 5. Estructura de Datos (Supabase Schema)
Las tablas principales están optimizadas con índices estratégicos:
- `products`: Almacena el DNA del producto y su SKU de estilo.
- `product_variants`: Gestión de stock, color (`barcode`) y talla.
- `orders`: Registro de ventas con cálculo automático de impuestos (IGV) vía Triggers de DB.
- `marketing_assets`: Hub de contenido generado por IA para cada producto.

---

## 6. Documentos de Referencia en `/Documents`
Para detalles específicos, consulte:
1. `Matriz_Codigos_Barras.md`: Guía técnica de inventario.
2. `DESIGN_SYSTEM.md`: Manual de identidad visual y componentes.
3. `UX_Design_Documentation.md`: Estrategia de flujos y experiencia.
4. `ARQUITECTURA_TECNICA.md`: Detalles de infraestructura y API.

---
¡Este proyecto representa la cúspide del e-commerce moderno en Perú, fusionando moda de alta gama con tecnología AI de vanguardia!
