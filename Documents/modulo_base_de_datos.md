# Guía Detallada: Arquitectura de Base de Datos (2026)
## Matteo Salvatore - Motor de Datos Supabase/PostgreSQL

Este documento describe la estructura técnica, relaciones y lógica de datos del ecosistema de **Matteo Salvatore**, centralizado en la infraestructura de **Supabase**.

---

## 1. Motor de Datos y Seguridad
- **PostgreSQL**: Se utiliza el motor relacional avanzado de PostgreSQL por su robustez y capacidad de manejo de transacciones atómicas.
- **Row Level Security (RLS)**: Las tablas críticas (`users`, `orders`) cuentan con políticas de seguridad a nivel de fila, asegurando que solo el personal autorizado acceda a datos sensibles.
- **Conectividad**: El backend (Express) se comunica mediante el Supabase Client con autenticación por API Keys seguras.

---

## 2. Esquema Core: Productos y Variantes
La arquitectura está diseñada para manejar una gran diversidad de combinaciones de ropa:
- **`products`**: Tabla maestra que guarda nombres bilingües, descripciones SEO, slugs y la marca Matteo Salvatore.
- **`product_variants`**: Cada producto se desglosa en múltiples variantes que definen la combinación única de **Talla** y **Color**.
- **`product_images`**: Almacena las URLs de las fotos de estudio, vinculadas tanto al producto como a colores específicos.

---

## 3. Lógica de Inventario Multi-Tienda
A diferencia de sistemas básicos, el stock se distribuye geográficamente:
- **`stores`**: Define las ubicaciones físicas (Gamarra, San Borja, etc.).
- **`inventory`**: Tabla de cruce que mapea cuántas unidades de una `variant_id` existen en una `store_id`.
- **Atomic Operations (RPC)**: El descuento de stock se realiza mediante una función almacenada en la base de datos para garantizar que el descuento ocurra en una única operación indivisible, evitando errores de conteo bajo alta demanda.

---

## 4. Gestión de Pedidos y Logística
- **`orders`**: Registro central de transacciones con campos específicos para envíos (couriers, dirección, estatus de envío).
- **`order_items`**: Copia instantánea de los precios y variantes comprados en el momento exacto de la venta (evitando cambios si el precio sube después).
- **`shipping_status`**: Campo dinámico que orquesta los estados de logística (`pending`, `preparing`, `ready_for_shipping`, `shipped`).

---

## 5. Soporte Bilingüe y SEO
- **Estructura Dual**: Casi todas las tablas de contenido (`products`, `categories`, `blog`) incluyen columnas gemelas (ej: `name_es` y `name_en`).
- **Indexación Directa**: Se han creado índices GIN y B-Tree en columnas de búsqueda (`slug`, `sku`, `sku_variant`) para asegurar que la tienda cargue instantáneamente incluso con miles de productos.

---

## 6. Integración con Clientes y Consumidor
- **`customers`**: Perfil unificado de compradores que vincula sus datos con cada pedido histórico.
- **`complaints`**: Almacenamiento persistente de las hojas de reclamación para auditorías legales de Indecopi.

---
*La base de datos de Matteo Salvatore es el cimiento de una operación escalable, segura y preparada para el mercado global.*
