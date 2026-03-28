# Guía Detallada: Barra de Menú y Navegación (2026)
## Matteo Salvatore - Arquitectura de la Experiencia de Lujo

Este documento describe la estructura y funcionalidades de la Barra de Menú y el sistema de Navegación, el esqueleto principal que permite a los clientes explorar el mundo de **Matteo Salvatore** con elegancia y fluidez.

---

## 1. Diseño Modular y Adaptable (Sticky Header)
La barra de navegación es el elemento central de la interfaz:
- **Sticky Behavior**: Se mantiene fija en la parte superior durante el scroll para ofrecer acceso instantáneo a las secciones principales.
- **Micro-interacciones**: Efectos de "glassmorphism" y transiciones suaves al pasar el cursor (hover) para transmitir una sensación premium.
- **Responsividad**: Un menú de hamburguesa optimizado para móviles que despliega las categorías con facilidad táctil.

---

## 2. Navegación Dinámica por Categorías
El menú no es estático; se construye en tiempo real desde el Panel de Control:
- **Sincronización CMS**: Al añadir una nueva categoría raíz (ej: *Colección Gala*), esta aparece automáticamente en el menú principal.
- **Mega-Menú (Escritorio)**: Despliegue de subcategorías vinculadas para que el usuario llegue a lo que busca con un solo clic.
- **Priorización SEO**: Estructura de enlaces diseñada para que Google indexe el catálogo de forma jerárquica y eficiente.

---

## 3. Buscador Global en Tiempo Real
Ubicado de forma estratégica para reducir la fricción en la compra:
- **Instant Result Search**: Sugerencias de productos mientras el usuario escribe (asíncrono).
- **Match Bilingüe**: Capacidad de buscar por términos tanto en español como en inglés.
- **Acceso Directo**: Los resultados muestran miniaturas de productos para una selección rápida desde la misma barra de búsqueda.

---

## 4. Selector de Idioma (I18n Switcher)
El pilar de la internacionalización de la marca:
- **Conmutación Sin Pérdida**: Cambia entre **ES** y **EN** manteniendo al usuario en la misma página y posición actual.
- **Persistencia**: Recuerda la preferencia de idioma del cliente mediante cookies de sesión.
- **Localización de Menús**: Traducción instantánea de todas las etiquetas del menú (`Home` / `Inicio`, `Shop` / `Tienda`, etc.).

---

## 5. Accesos Directos a la Cuenta y Carrito
- **Carrito Persistente**: Indicador visual (badge) que muestra el número de ítems agregados en tiempo real.
- **Estado de Sesión**: Icono de usuario dinámico que cambia si el cliente está logueado o navegando como invitado.
- **Notificaciones**: Acceso rápido a las notificaciones de estado de pedido desde el área personal.

---
*La navegación de Matteo Salvatore garantiza que la elegancia de la marca se traduzca en una experiencia de usuario sin fricciones.*
