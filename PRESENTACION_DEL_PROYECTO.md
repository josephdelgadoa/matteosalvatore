# Matteo Salvatore – Documento de Presentación de Módulos (2026)

## 📌 Visión General
**Matteo Salvatore** es una plataforma de e-commerce premium especializada en ropa masculina de lujo minimalista, con un enfoque absoluto en el uso del mejor Algodón Pima Peruano. Desarrollada con un stack tecnológico de última generación, la arquitectura fusiona una experiencia web ultra rápida para el usuario final *(Frontend)* con un panel de gestión potenciado por Inteligencia Artificial y microservicios escalables *(Backend)*.

---

## 🎨 Módulos del Frontend (Next.js / TypeScript)

La cara visible del ecosistema se enfoca en rendimiento, SEO y una experiencia estética de "Quiet Luxury".

### 1. Customer Storefront (Catálogo y Tienda)
- **Componentes**: Home, Product Listing Page (PLP), Product Detail Page (PDP).
- **Tecnologías**: SSR (Server-Side Rendering) y Componentes de Servidor de React para renderizado ultra-rápido.
- **Beneficio de Negocio**: Experiencia de navegación hiper-fluida que retiene clientes premium. El SEO técnico activo (meta tags dinámicos, product schemas) posiciona automáticamente a la marca en búsquedas globales desde el primer día.

### 2. Elite AI Content Engine (Motor de Contenido IA V2026)
- **Componentes**: Herramienta de auto-generación integrada interactivamente en el portal de administración del frontend.
- **Funcionalidad**: A partir de datos clave mínimos, interactúa con el backend para autocompletar formularios extensos, traducir textos al idioma secundario (ES/EN), formatear descripciones ricas en HTML y generar lineamientos SEO. Adicionalmente, cuenta con resguardos estrictos que previenen "alucinaciones" (conservando los nombres de colores o variaciones a la perfección).
- **Beneficio de Negocio**: La velocidad de carga de nuevos volúmenes al catálogo se multiplica por 10. Las descripciones producidas simulan la pluma de un Copywriter experto en "Luxury Fashion", garantizando la redacción bilingüe de élite sin necesidad de tercerización.

### 3. Admin Dashboard (Panel Administrativo General)
- **Componentes**: Interfaz segura de gestión de Productos, Inventarios, y Variantes de Talla / Color.
- **Funcionalidad**: Interfaz intuitiva y resiliente enfocada en la autonomía del administrador. Incluye manejo automático de 'slugs' bilingües, manipulación visual tipo drag-and-drop y control directo sobre los identificadores (SKUs) en caso de productos con colisión intencional.
- **Beneficio de Negocio**: Control total e independiente sobre la oferta y visibilidad del producto sin necesidad del soporte constante del equipo técnico.

### 4. Checkout Inteligente y Checkout Transparente (Culqi Integrado)
- **Componentes**: Drawer Cart (Carrito deslizante) y embudo de pago de 3 pasos minimalista.
- **Funcionalidad**: Flujo transparente que calcula dinámicamente el IGV (18%) sobre los montos finales y transfiere los datos con encriptación tokenizada a la pasarela de pagos Culqi.
- **Beneficio de Negocio**: Garantiza un descenso radical del abandono del carrito gracias a la experiencia libre de interrupciones, cálculo transparente y seguridad certificada a nivel bancario.

---

## ⚙️ Módulos del Backend (Node.js / Express / Postgres)

El cerebro y orquestador de las operaciones. Combina infraestructura transaccional sólida con automatización asíncrona experta.

### 1. Sistema 'Matrix' (Algoritmo de Identificación de Inventarios)
- **Funcionalidad**: Algoritmo central para la asignación de Identidad unificada de Producto. Reconoce, intercepta y mapea cientos de variaciones de colores (ingresados por usuarios tanto en Español como en Inglés) junto a sus respectivas tallas.
- **Estructura del SKU**: Asigna un código único estricto de 11 dígitos por variante física (`[Código Estilo Core - 8 dig] + [Id Color - 2 dig] + [Id Talla - 1 dig]`).
- **Beneficio de Negocio y Logístico**: Elimina definitivamente la ambigüedad en el almacén. Previene la colisión virtual de SKUs en base de datos, garantizando que el stock digital resuene perfectamente con la realidad física (WMS o ERP de la marca).

### 2. Microservicio de Inteligencia Artificial (Google Gemini Integration)
- **Funcionalidad**: Motor interno que despacha prompts exclusivos elaborados para retornos estructurados en formato rígido `JSON` (previniendo por completo la omisión de data a la hora de procesar o guardar).
- **Beneficio Funcional**: Automatiza toda la carga creativa de la marca: desde copys bilingües perfectos, hasta kits completos listos para redes sociales (Instagram/TikTok), descripciones de Ads para Meta/Facebook, sugerencias de *Cross-Sell* y arquitecturas de datos semánticos. Literalmente convierte la plataforma en su propia red de agencias de marketing nativa e interna.

### 3. Motor de Ordenes y Webhooks Operativos
- **Funcionalidad**: Base receptor que procesa los webhooks provenientes del sistema Culqi en segundo plano, así como orquestador asincrónico para integraciones extra de marketing (como comunicaciones programáticas por Twilio y envío de emails robustos con Resend).
- **Beneficio de Negocio**: Al manejar los pagos transaccionales en formato webhook asíncrono, la orden jamás se pierde frente a micro-fallas de red de los usuarios durante la confirmación final. Establece la base real para notificaciones automáticas inmediatas (facturación, envío por WhatsApp y confirmaciones en tiempo real) que encantan al consumidor moderno.

---

## 💡 Resumen Estratégico

El proyecto **Matteo Salvatore** logra materializar un hito donde la moda purista de alta costura interactúa con el ecosistema de **Inteligencia Artificial de Vanguardia de forma invisible para el operador.** 
La plataforma no solo fue pensada para vender ropa, sino configurada para operar eficientemente bajo carga masiva sin la carga contenciosa del Data-Entry tradicional. El equipo técnico ha encapsulado la bilingüidad nativa, la autosuficiencia de marketing SEO y sistemas invulnerables de inventariado dentro del mismo núcleo que presenta un storefront brillante al mercado premium.
