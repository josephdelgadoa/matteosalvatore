# Documentación de Generación de Pedidos: Matteo Salvatore

Esta documentación explica el flujo técnico de cómo el sistema genera y procesa una orden de compra, tomando como ejemplo el pedido real **MS-751873A6**.

---

## 1. Identificación del Pedido (Order Number)

El sistema utiliza un generador criptográfico para asegurar que cada número de pedido sea único y profesional.

- **Prefijo**: `MS-` (Matteo Salvatore)
- **Algoritmo**: `crypto.randomBytes(4)` (Genera 4 bytes aleatorios)
- **Formato**: Hexadecimal en mayúsculas.
- **Ejemplo**: `MS-751873A6`

*Archivo: `backend/src/controllers/orderController.js` (Línea 12)*

---

## 2. Proceso de Creación en el Backend

Cuando un cliente (registrado o invitado) finaliza el checkout, el frontend envía una solicitud `POST` a `/api/orders`. El controlador realiza los siguientes pasos:

### A. Cálculo de Impuestos y Desglose (IGV 18%)
El sistema asume que los precios mostrados incluyen el **18% de IGV** (Estándar en Perú).
- **Subtotal Base**: `Total / 1.18`
- **Monto de Impuesto (IGV)**: `Total - Subtotal Base`

### B. Inserción en la Tabla `orders`
Se crea el registro principal con los siguientes datos:
- `order_number`: El ID generado (ej. `MS-751873A6`).
- `customer_id`: El UUID del usuario (si está logueado) o `null` (si es un invitado/guest).
- `email`: El correo electrónico proporcionado en el checkout.
- `shipping_address`: Objeto JSON (luego stringificado) con dirección, ciudad, distrito y teléfono.
- `status`: Por defecto inicia como `'pending'`.

### C. Inserción de Items (`order_items`)
Cada producto del carrito se vincula a la orden mediante el `order_id` (UUID interno).
- Se guarda el nombre del producto, cantidad y precio unitario.
- **Detalles de Variante**: El sistema concatena la Talla y el Color en una cadena legible: `Talla: XL, Color: Celeste Bebé`.

---

## 3. Lógica de Asociación (Guest vs Account)

Una de las mejoras recientes permite que los usuarios vean sus pedidos incluso si los hicieron como invitados antes de registrarse o iniciar sesión.

- **Vínculo por Email**: Al consultar el historial, el sistema busca coincidencias tanto por `customer_id` como por el `email` asociado a la orden.
- **Visibilidad**: Esto garantiza que órdenes como la **MS-751873A6** (donde `customer_id` es `null`) aparezcan en el panel de cuenta del usuario dueño de ese correo.

---

## 4. Visualización en el Panel de Administración

El administrador puede ver el desglose completo en la ruta:
`/admin/orders/35d11d1f-8c4f-49f8-8125-cbf6e50068a0`

- El sistema recupera la orden y sus items.
- Realiza el parseo dinámico de la dirección de envío (JSON) para mostrarla de forma estructurada.

---

## Resumen Técnico del Caso MS-751873A6
- **UUID Interno**: `35d11d1f-8c4f-49f8-8125-cbf6e50068a0`
- **Tipo de Cliente**: Invitado (Guest)
- **Items**: 1x Polo Esencial Pima (S/. 39.90)
- **Estado**: Pagado / Pendiente (Según flujo de Culqi)
