# Documentación Técnica Completa: Ecosistema Digital Matteo Salvatore (2026)

## 1. Resumen Ejecutivo
El ecosistema digital de **Matteo Salvatore** es una plataforma de comercio electrónico de lujo diseñada para ofrecer una experiencia bilingüe (ES/EN) de alto impacto. Integra una tienda online avanzada, un sistema de gestión administrativa (ERP/Admin) y un terminal de punto de venta (POS) táctil para tiendas físicas.

---

## 2. Presentación y Diseño
- **Estética**: Diseño minimalista, tipografía refinada (Serif para títulos, Sans-serif para lectura) y una paleta de colores curada (**Ivory, Pearl, Fog, Black**).
- **Core UX**: Navegación fluida, animaciones sutiles con `framer-motion` y adaptabilidad total (móvil, tablet, desktop).
- **Internacionalización (i18n)**: Soporte completo para español e inglés en todo el catálogo y procesos de compra.

---

## 3. Arquitectura de Base de Datos (Supabase/PostgreSQL)
La base de datos centralizada en Supabase gestiona las siguientes entidades principales:
- `products` / `product_variants`: Catálogo y SKU de 11 dígitos.
- `orders` / `order_items`: Pedidos, pagos y estados de envío.
- `inventory`: Stock en tiempo real mapeado por tienda y variante.
- `stores`: Ubicaciones físicas (**Gamarra, San Borja**).
- `customers` / `users`: Base de datos de clientes y perfiles administrativos.
- `complaints`: Libro de reclamaciones digital.

---

## 4. Módulo de Productos
- **Gestión**: Creación y edición de productos con soporte para descripciones SEO largas y cortas.
- **Variantes**: Sistema de tallas y colores con generación automática de SKUs inteligentes.
- **IA**: Integración con **Google Gemini** para generar nombres cortos, títulos SEO, descripciones de marketing y hashtags sociales automáticamente.

---

## 5. Módulo Blog & Contenidos
- **Editor**: Sistema de gestión de artículos con editor de texto enriquecido (Rich Text).
- **SEO**: Cada entrada cuenta con metadatos optimizados para indexación en Google.
- **Visuales**: Soporte para imágenes destacadas y miniaturas.

---

## 6. Categorías y Taxonomía
- **Estructura**: Categorías raíz y subcategorías (ej: *Camisas -> Lino*).
- **Imágenes de Categoría**: Cada categoría cuenta con una imagen de cabecera que define la estética de la sección en la tienda.
- **SEO**: Slugs amigables e internacionalizados.

---

## 7. Módulo de Pedidos (Ordenes)
- **Checkout**: Flujo bilingüe optimizado para invitados y usuarios registrados.
- **Pagos**: Integración segura con **Culqi**.
- **Logística**: Flujo de estados (**Pagado -> Preparando -> Listo -> Enviado**).
- **Impresión**: Generación de recibos profesionales en formato PDF.

---

## 8. Gestión de Tiendas e Inventario
- **Multi-Tienda**: Control independiente para **Gamarra Store** y **San Borja Store**.
- **Fulfillment**: El administrador decide desde qué tienda surtir cada pedido, sincronizando el stock al instante.
- **Exportación**: Herramienta para descargar el inventario completo en formato Excel (CSV UTF-8).

---

## 9. AI Inventory Dashboard
Panel de análisis avanzado que utiliza IA para:
- **Vista por Familia**: Agrupa variantes por nombre corto para ver el stock total de un modelo.
- **Visualización**: Gráficos modernos con paletas vibrantes para identificar productos estrella y rotación.
- **Filtros Inteligentes**: Búsqueda por color, talla o tipo de prenda.

---

## 10. Terminal POS (Touch Experience)
Optimizado para **iPad Pro** y monitores táctiles en tiendas físicas:
- **Grid Visual**: Selección de productos mediante miniaturas (imágenes secundarias).
- **Flujo en 3 Pasos**: Producto -> Color -> Talla.
- **Controles Táctiles**: Botones de cantidad (+/-) grandes para operación rápida en tienda.

---

## 11. Gestión de Clientes y Usuarios
- **Clientes**: Registro automático de compradores (incluyendo invitados) con historial de compras unificado por correo electrónico.
- **Usuarios Admin**: Control de acceso para el personal administrativo de Matteo Salvatore.

---

## 12. Libro de Reclamaciones Digital
- **Cumplimiento**: Módulo legal requerido por ley para la atención de quejas y reclamos.
- **Notificación**: Envío automático de copias del reclamo al cliente y al administrador vía SMTP.

---

## 13. Barra de Menú y Navegación
- **Dinámica**: Menú superior optimizado para SEO con acceso rápido a categorías principales.
- **Buscador**: Sistema de búsqueda global en tiempo real para encontrar productos instantáneamente.

---
*Documento generado para el equipo de administración de Matteo Salvatore.*
