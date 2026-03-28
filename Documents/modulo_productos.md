# Guía Detallada: Módulo de Productos (2026)
## Matteo Salvatore - Sistema de Gestión de Lujo

Este documento describe a profundidad el funcionamiento del Módulo de Productos, el corazón del ecosistema digital de **Matteo Salvatore**.

---

## 1. Gestión Integral de Productos (CRUD)
El administrador puede crear, editar y duplicar productos desde una interfaz unificada. Cada producto contiene los siguientes campos clave:
- **Nombre Completo (ES/EN)**: Títulos descriptivos para la ficha de producto y SEO.
- **Nombre Corto (ES/EN)**: Etiquetas compactas (ej: "Polo Pima Básico") utilizadas en el dashboard, inventario y POS.
- **Slugs (ES/EN)**: Identificadores únicos para las URLs bilingües.
- **Precios**: Precio base en Soles (S/.) con desglose automático de IGV.

---

## 2. Sistema de Variantes y SKU Matrix
Cada prenda se desglosa en múltiples variantes para cubrir todas las combinaciones posibles.

### Estructura del SKU (11 Dígitos):
El sistema utiliza un código de barras inteligente compuesto por tres partes: `[Estilo_8][Color_2][Talla_1]`.

- **Estilo (8 dígitos)**: Identifica el tipo de prenda (ej: `00513000` para Hoodies).
- **Color (2 dígitos)**: Mapeo interno de colores (ej: `13` para Negro, `11` para Hueso).
- **Talla (1 dígito)**: Identificador numérico de talla (ej: `2` para M, `3` para L).

*Ejemplo de SKU Final:* `00513000132` (Hoodie Classic, Negro, Talla M).

---

## 3. Inteligencia Artificial (AI Elite Kit)
El módulo está integrado con **Google Gemini (AI)** para automatizar la creación de contenido de alta conversión.

### Funciones de la IA:
1. **Generación de Nombres**: Sugiere nombres cortos y descriptivos basados en el tipo de prenda.
2. **Copywriting SEO**: Redacta títulos y meta-descripciones optimizadas para Google en ambos idiomas.
3. **Marketing Assets**: Genera leyendas (captions) para Instagram/TikTok, guiones para Reels y copys para anuncios de Meta.
4. **Keyword Research**: Extrae automáticamente las palabras clave más relevantes del producto.

---

## 4. Gestión de Imágenes y Visuales
- **Carga Múltiple**: El sistema soporta el arrastre de múltiples imágenes.
- **Imagen Primaria**: Se utiliza para el catálogo principal de la tienda.
- **Imagen Secundaria (Icono)**: Utilizada específicamente en el **Terminal POS** para una identificación visual rápida mediante miniaturas.
- **Asignación de Color**: Cada imagen puede asociarse a un color específico para mostrarse dinámicamente cuando el cliente selecciona una variante.

---

## 5. SEO y Estrategia Digital
El módulo permite un control granular de la presencia digital:
- **Indexación**: Control de visibilidad (`is_active`).
- **Metadatos**: Campos específicos para `SEO Title` y `SEO Description` que mejoran el posicionamiento en buscadores.
- **Categorización**: Taxonomía de dos niveles (**Categoría -> Subcategoría**) para una navegación lógica y estructurada.

---
*Este módulo fue diseñado para escalar el catálogo de Matteo Salvatore con máxima eficiencia y elegancia visual.*
