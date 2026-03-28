# Guía Detallada: Módulo de Categorías y Taxonomía (2026)
## Matteo Salvatore - Organización del Catálogo de Lujo

Este documento describe la estructura y el funcionamiento del sistema de Categorización y Taxonomía, diseñado para ofrecer una navegación lógica y premium en el ecosistema de **Matteo Salvatore**.

---

## 1. Estructura de Taxonomía de Dos Niveles
El sistema organiza los productos en una jerarquía clara para facilitar el descubrimiento:
- **Categorías Raíz (Padre)**: Representan las divisiones principales del catálogo (ej: *Camisas, Pantalones, Accesorios*).
- **Subcategorías (Hijos)**: Desgloses específicos dentro de cada categoría raíz (ej: *Lino, Algodón Pima, Slim Fit*).
- **Flexibilidad**: Cada categoría puede activarse o desactivarse independientemente (`is_active`).

---

## 2. Gestión Visual de Categorías
Cada categoría raíz cuenta con una identidad visual propia en el frontend:
- **Imagen de Cabecera (Banner)**: Se utiliza como fondo artístico en la página de listado de esa categoría, manteniendo la estética de la marca.
- **Miniaturas de Navegación**: Utilizadas en los menús desplegables y secciones de "Explorar" para guiar visualmente al cliente.
- **Consistencia**: El sistema soporta la carga de imágenes en alta resolución con optimización automática.

---

## 3. Soporte Bilingüe e Internacionalización
Las categorías están diseñadas para un alcance global:
- **Nombres Duales**: Campos específicos para `name_es` y `name_en`.
- **Slugs Localizados**: Permite URLs temáticas según el idioma (ej: `/categorias/camisas-lino` vs `/en/categories/linen-shirts`).
- **Navegación Dinámica**: El menú de navegación se reconstruye automáticamente en el idioma seleccionado por el usuario.

---

## 4. Optimización SEO y Enlazado
El módulo de categorías es fundamental para el posicionamiento en buscadores:
- **Metadatos SEO**: Cada categoría permite definir títulos y descripciones SEO optimizadas.
- **Enlazado Interno**: Estructura de silos de contenido que mejora la autoridad de dominio (Internal Linking).
- **URLs Limpias**: Generación automática de slugs amigables a partir del nombre en español e inglés.

---

## 5. Asociación con Productos
- **Vinculación Directa**: Cada producto se asigna a una categoría raíz y, opcionalmente, a una subcategoría.
- **Filtrado Inteligente**: La taxonomía permite que los clientes filtren productos instantáneamente por material, estilo o tipo desde los menús laterales de la tienda.

---
*La taxonomía de Matteo Salvatore garantiza que la elegancia de la marca se traduzca en una navegación intuitiva y profesional.*
