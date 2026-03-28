# Guía Detallada: Gestión de Tiendas e Inventario (2026)
## Matteo Salvatore - Control Maestro de Almacén

Este documento describe el funcionamiento técnico y operativo del sistema de Gestión de Tiendas e Inventario centralizado de **Matteo Salvatore**.

---

## 1. Estructura Multi-Tienda
El sistema permite gestionar múltiples ubicaciones físicas de manera independiente:
- **Gamarra Store**: Almacenamiento central y tienda principal de producción.
- **San Borja Store**: Tienda de atención al cliente y despacho rápido.
- **Ubicación Virtual**: Almacén dedicado exclusivamente para ventas online (opcional).

Cada tienda tiene su propio ID único en la base de datos, lo que permite una trazabilidad total de dónde se encuentra cada prenda.

---

## 2. Mapeo Tiempo Real (Variante vs Tienda)
El inventario no se guarda de forma global, sino a nivel de **Variante + Tienda**:
- Una misma variante (ej: *Polo Pima Black M*) puede tener 10 unidades en Gamarra y 5 en San Borja.
- El sistema suma estas cantidades para mostrar el stock total en el e-commerce, pero permite al administrador elegir de qué tienda descontar al procesar un pedido.

---

## 3. Sincronización Atómica de Stock
Para evitar errores de conteo o "overselling" (sobreventa):
- **Transacciones Seguras**: El descuento de stock ocurre en una única operación atómica durante el surtido (fulfillment).
- **Prevención de Errores**: El sistema no permite confirmar una tienda de surtido si esta no cuenta con las unidades físicas necesarias de la variante solicitada.

---

## 4. Herramienta de Exportación (Excel/CSV)
Para facilitar auditorías físicas y reportes contables:
- **Botón Excel**: Disponible en la cabecera del módulo de Gestión de Inventario.
- **Formato**: Genera un archivo `.csv` optimizado con codificación UTF-8 BOM.
- **Compatibilidad**: Diseñado para abrirse en Microsoft Excel sin errores de tildes o caracteres especiales.
- **Campos Exportados**: Producto, SKU (Matrix), Talla, Color, Precio Base y Stock Actual por Tienda.

---

## 5. Visualización del SKU Matrix
Para agilizar el trabajo en el almacén físico:
- **Código de 11 Dígitos**: En el panel de inventario se muestra el SKU completo `[Estilo][Color][Talla]`.
- **Referencia Rápida**: El personal puede comparar el código en pantalla con la etiqueta física de la prenda, reduciendo errores de despacho.
- **Filtros por Tienda**: Selector rápido para conmutar entre el stock de San Borja y Gamarra con un solo clic.

---
*El sistema de inventario de Matteo Salvatore garantiza que la promesa de disponibilidad al cliente siempre se cumpla con precisión quirúrgica.*
