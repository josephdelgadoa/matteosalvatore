# Guía Detallada: Módulo de Blog y Contenidos (2026)
## Matteo Salvatore - Comunicación Digital de Lujo

Este documento describe el funcionamiento del Módulo de Blog y Gestión de Contenidos, diseñado para posicionar a **Matteo Salvatore** como un referente de estilo y calidad.

---

## 1. Gestión de Artículos (CRUD)
El administrador tiene control total sobre las publicaciones del blog desde una interfaz dedicada:
- **Creación**: Interfaz limpia para redactar nuevos artículos desde cero.
- **Edición**: Capacidad para actualizar contenidos, corregir errores o añadir nuevas tendencias.
- **Estados**: Soporte para artículos activos (`publicados`) o inactivos (`borradores`).

---

## 2. Editor de Texto Enriquecido (Rich Text)
Para garantizar una presentación visual impecable, el sistema integra **React Quill**:
- **Formato**: Negritas, itálicas, subrayados y bloques de código.
- **Estructura**: Listas (numeradas/viñetas), citas (blockquotes) y alineación de párrafos.
- **Multimedia**: Capacidad de insertar imágenes nativas y enlaces externos directamente en el cuerpo del artículo.

---

## 3. Soporte Bilingüe (Internacionalización)
Fiel al enfoque global de la marca, cada artículo permite:
- **Contenido Dual**: Campos separados para el cuerpo del artículo en **Español** e **Inglés**.
- **Slugs Localizados**: URLs amigables que cambian según el idioma (ej: `/blog/tendencias-lino` vs `/en/blog/linen-trends`).
- **Títulos y Resúmenes**: Títulos y extractos independientes por idioma para una lectura natural.

---

## 4. Estrategia SEO y Visibilidad
Cada entrada de blog está diseñada para atraer tráfico orgánico:
- **Metadatos SEO**: Campos para `SEO Title` y `SEO Description` optimizados para motores de búsqueda.
- **URL Friendly**: Slugs limpios generados automáticamente a partir del título.
- **Miniaturas (Featured Images)**: Gestión de una imagen destacada que se muestra en el listado principal del blog y al compartir en redes sociales.

---

## 5. Categorización y Tags
- **Organización**: Opción de asignar categorías a los artículos para facilitar la navegación del usuario (ej: *Estilo de Vida, Calidad de Telas, Moda Masculina*).
- **Asociación**: Posibilidad de vincular artículos de blog con productos específicos para potenciar el cross-selling.

---
*El Módulo de Blog es la herramienta clave para elevar la narrativa de marca de Matteo Salvatore.*
