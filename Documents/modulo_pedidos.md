# Guía Detallada: Módulo de Pedidos y Surtido (2026)
## Matteo Salvatore - Gestión de Órdenes y Logística de Lujo

Este documento describe el flujo completo de vida de un pedido y el sistema de surtido (fulfillment) integrado en el ecosistema digital de **Matteo Salvatore**.

---

## 1. Ciclo de Vida del Pedido
Cada orden atraviesa estados específicos para garantizar un control total de la operación:
- **Paid (Pagado)**: El cliente ha completado el pago vía Culqi o transferencia.
- **Preparing (En Preparación)**: El almacén ha recibido la orden y está separando las prendas.
- **Ready for Shipping (Listo para Envío)**: El paquete está embalado y esperando al courier.
- **Shipped (Enviado)**: El paquete ha sido entregado al courier y el cliente tiene su tracking.
- **Delivered (Entregado)**: Confirmación final de recepción.

---

## 2. Integración de Pagos (Culqi)
- **Seguridad**: Se utiliza el sistema de tokens de Culqi para procesar tarjetas de forma segura.
- **Validación**: El backend verifica el estado de la transacción antes de confirmar el pedido.
- **Registro**: Se capturan datos de facturación, montos, IGV (18%) y costos de envío dinámicos.

---

## 3. Surtido Multinivel y Sincronización de Stock
El sistema permite gestionar inventarios compartidos pero distribuidos físicamente:
- **Selección de Tienda**: Al iniciar el proceso de surtido, el administrador elige si el pedido saldrá de **Gamarra Store** o **San Borja Store**.
- **Deducción Atómica**: Al marcar como "Preparar", el sistema descuenta automáticamente las unidades de la tienda elegida, evitando el "overselling" o sobreventa.
- **Validación de Variantes**: Se verifica que la talla y el color coincidan exactamente con el SKU de 11 dígitos.

---

## 4. Gestión de Envíos y Couriers
El módulo de logística permite una comunicación clara con el cliente:
- **Couriers Oficiales**: Soporte integrado para **Olva**, **Shalom** y **Scharff**.
- **Tracking Code**: Registro manual o automático del código de seguimiento.
- **Estados de Envío**: Seguimiento del estatus "En Tránsito" hasta la entrega final.

---

## 5. Notificaciones Automáticas (SMTP)
El cliente es informado en tiempo real mediante correos electrónicos oficiales:
1. **Notificación de Preparación**: Se envía cuando el administrador inicia el surtido.
2. **Notificación de Despacho**: Se envía cuando el paquete es entregado al courier, incluyendo el enlace de seguimiento y el nombre de la empresa de transporte.

---

## 6. Panel de Administración y Herramientas
- **Detalle de Orden**: Visualización completa de ítems con imágenes y SKUs.
- **Impresión de Recibo**: Botón dedicado para generar un comprobante PDF optimizado (sin navegación y con logo de marca).
- **Control de Logs**: Historial de cambios de estado para auditoría interna.

---
*El módulo de pedidos de Matteo Salvatore une la elegancia del front-end con la precisión operativa del back-end.*
