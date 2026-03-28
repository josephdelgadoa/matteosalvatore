# Guía Detallada: AI Inventory Dashboard (2026)
## Matteo Salvatore - Análisis de Datos Inteligente

Este documento describe el funcionamiento del **AI Inventory Dashboard**, una herramienta de visualización avanzada diseñada para que la gerencia de **Matteo Salvatore** tome decisiones basadas en datos reales.

---

## 1. Concepto: Agrupación por Familia de Producto
A diferencia del listado de inventario tradicional, el Dashboard agrupa las miles de variantes individuales por su **Nombre Corto** (ej: *Camisa Tulum*).
- **Visión Global**: Permite ver cuántas unidades totales existen de un modelo, sumando todas sus tallas y colores.
- **Reducción de Ruido**: Evita listas repetitivas de "Camisa Tulum" para cada combinación, ofreciendo una vista limpia y ejecutiva.

---

## 2. Visualización Dinámica y Moderna
El dashboard utiliza gráficos de barras interactivos con una paleta de colores vibrantes (tonos pastel y fuertes) para una mejor legibilidad:
- **Barras por Variante**: Cada barra representa el stock actual de un modelo específico.
- **Micro-animaciones**: Transiciones suaves al filtrar o cambiar de tienda para una experiencia de usuario premium.
- **Eje de Cantidades**: Escala automática para comparar rápidamente productos de alta rotación vs. stock excedente.

---

## 3. Filtros Avanzados (Expert View)
La administradora cuenta con opciones de visualización flexible según lo que necesite analizar:
- **Por Color**: Desglosa el stock total de un producto por sus variaciones cromáticas.
- **Por Talla**: Muestra la distribución de tallas disponibles para un modelo específico.
- **Combinaciones**: Permite cruzar filtros para ver, por ejemplo, cuántas Camisas Tulum en color Gris y talla L quedan en bodega.
- **Filtro Global**: Opción para ver el stock consolidado sin importar variantes.

---

## 4. Selector de Tienda Inteligente
El dashboard permite auditar el stock de manera geográfica:
- **San Borja vs Gamarra**: Cambio instantáneo entre almacenes para balancear el stock entre tiendas físicas.
- **Detección de Quiebres**: Resalta visualmente (en rojo) cuando una familia de producto o variante crítica tiene menos de 10 unidades.

---

## 5. Integración con el Sistema de Gestión
- **Sincronización Automática**: Los datos del gráfico se actualizan en tiempo real cada vez que ocurre un ajuste manual o una venta (POS/E-commerce).
- **Consistencia de Nombres**: Utiliza el motor de nombres generado por la IA (Gemini) para asegurar que las etiquetas en los gráficos sean profesionales y concisas.

---
*El AI Inventory Dashboard es el cerebro estratégico para el crecimiento de Matteo Salvatore.*
