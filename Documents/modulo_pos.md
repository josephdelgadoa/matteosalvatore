# Guía Detallada: Terminal Punto de Venta (POS) (2026)
## Matteo Salvatore - Experiencia Táctica en Tienda Física

Este documento describe el funcionamiento del **Terminal POS**, diseñado específicamente para una operación táctil rápida y elegante en los puntos de venta físicos de **Matteo Salvatore**.

---

## 1. Experiencia Touch-First (iPad Pro)
El POS ha sido optimizado para dispositivos táctiles mediante:
- **Botones de Tamaño Generoso**: Facilitan la interacción sin necesidad de punteros precisos.
- **Micro-animaciones**: Feedback visual instantáneo con `framer-motion` al seleccionar productos o cambiar cantidades.
- **Scroll Infinito**: Navegación fluida por el catálogo de productos mediante gestos táctiles.

---

## 2. Configuración de Doble Pantalla (Dual Display)
Para elevar la experiencia de compra en tienda, el sistema soporta una configuración de dos monitores:
- **Monitor de Staff (iPad Pro)**: Interfaz de control para que el vendedor seleccione productos y gestione el pago.
- **Monitor de Cliente (Customer Facing)**: Muestra el resumen de compra en tiempo real, imágenes de alta calidad del producto seleccionado y el total a pagar, reforzando la transparencia y sofisticación de la marca.

---

## 3. Grid Visual de Productos
Para una identificación ultra-rápida de las prendas:
- **Miniaturas de Alta Calidad**: Utiliza la segunda imagen del producto (icono o foto de estudio) para que el personal reconozca el artículo al instante.
- **Nombres Cortos**: Etiquetas claras (ej: "Polo Pima", "Camisa Tulum") que evitan la confusión visual.
- **Buscador Inteligente**: Barra de búsqueda superior para filtrar por SKU o nombre en segundos.

---

## 4. Flujo de Selección de 3 Pasos
El sistema guía al vendedor mediante un flujo lógico y sin errores:
1. **Producto**: Selección de la prenda base desde el grid visual.
2. **Color**: Selección de la variante cromática disponible.
3. **Talla**: Selección de la medida del cliente.
*Resultado*: Cálculo automático del precio y stock en la parte inferior.

---

## 5. Control de Cantidades y Carrito
- **Sumar/Restar (+/-)**: Botones táctiles intuitivos para ajustar la cantidad de prendas rápidamente.
- **Resumen Lateral**: Un "Checkout" lateral que muestra el total, subtotal e IGV (18%) de forma transparente.
- **Multiproducto**: Permite añadir múltiples prendas de distintos tipos al mismo ticket de venta.

---

## 6. Integración y Sincronización
- **Inventario Local**: Cada venta realizada en el POS descuenta automáticamente el stock de la tienda física activa (Gamarra o San Borja).
- **Consistencia de Precios**: Los precios se sincronizan con la base de datos central en tiempo real.
- **Origen de Venta**: Las transacciones se etiquetan como `POS` para facilitar el cierre de caja y reportes de rentabilidad por tienda física.

---
*El Terminal POS de Matteo Salvatore redefine la venta física con tecnología de vanguardia y elegancia.*
