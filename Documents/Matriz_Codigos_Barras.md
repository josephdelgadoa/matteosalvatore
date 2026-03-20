# Guía de Implementación: Matriz de Códigos de Barras (Actualizado Marzo 2026)

Este documento es la "Fuente de Verdad" para la creación de nuevos productos y la gestión de inventario en Matteo Salvatore.

## 🚀 Estado Actual del Sistema
> [!IMPORTANT]
> **Full Reset Ejecutado (19 Marzo 2026):** Se ha realizado un reinicio total de la base de datos. El catálogo está vacío y listo para recibir nuevos productos desde cero siguiendo esta estructura.

## Cambios Implementados

### 1. Esquema de Base de Datos & Admin
- **Nuevas Columnas:** Se añadieron `barcode` (VARCHAR, UNIQUE) y `sku_variant` a la tabla `product_variants`.
- **Búsqueda Avanzada:** El panel de administración permite buscar por **Código de Estilo**, Nombre o Categoría.
- **Elite AI Ready:** Integración con Gemini 2.5 Flash para generación de metadatos SEO y descripciones de lujo.

### 2. Lógica de la Matriz de Códigos de Barras
Implementamos una matriz de 3 partes para cada variante:
- **Prefijo de Estilo (8 dígitos):** Identificador base del producto.
- **Identidad de Color (2 dígitos):** ID único para los 42 colores oficiales.
- **Identidad de Talla (1 dígito):** ID único para tallas.

**Fórmula de Barcode:** `[Estilo_8][Color_2][Talla_1]` (Total: 11 dígitos numéricos).

---

## 🎨 Referencia de Identidades de Color (42 Colores Oficiales)
| ID | Color | ID | Color |
| :--- | :--- | :--- | :--- |
| **01** | AZUL | **22** | MARRÓN / TOPO |
| **02** | AZUL MARINO | **23** | MELANGE |
| **03** | AZUL NOCHE | **24** | MELANGE CLARO |
| **04** | AZUL ACERO | **25** | NEGRO |
| **05** | BEIGE | **26** | PALO ROSA |
| **06** | BEIGE / ARENA | **27** | PLOMO |
| **07** | BEIGE / CREMA | **28** | PLOMO PLATA |
| **08** | BLANCO | **29** | PLOMO RATA |
| **09** | CAMELL | **30** | ROJO |
| **10** | CELESTE BEBÉ | **31** | ROSADO BEBÉ |
| **11** | CELESTE PASTEL | **32** | ROSA CLARO |
| **12** | CEMENTO | **33** | SKY |
| **13** | CREMA | **34** | TURQUESA |
| **14** | GRIS | **35** | VERDE |
| **15** | GRIS ACERO | **36** | VERDE BOTELLA |
| **16** | GRIS CARBÓN | **37** | VERDE OLIVA |
| **17** | GRIS HIELO | **38** | VERDE OLIVO / MILITAR |
| **18** | GUINDA | **39** | VERDE MILITAR |
| **19** | HUESO | **40** | VERDE CEMENTO |
| **20** | MARRÓN | **41** | VINO |
| **21** | MARRÓN / TABACO | **42** | ARENA |

---

## 📏 Mapeo de Tallas
| Talla | ID | Talla | ID |
| :--- | :--- | :--- | :--- |
| **XS / 28** | 0 | **XL / 34** | 4 |
| **S / 30** | 1 | **XXL / 36** | 5 |
| **M / 32** | 2 | **38** | 6 |
| **L / 34** | 3 | **40** | 7 |

---

## 🏷️ Mapeo de Estilos (Prefijos)
| Estilo | Prefijo de Estilo | Categoría Sugerida |
| :--- | :--- | :--- |
| **Polo Pima Básico** | `00501000` | Polos / Tops |
| **Polo Oversize** | `00502000` | Polos / Tops |
| **Polo Boxi** | `00503000` | Polos / Tops |
| **Polo Henley MC** | `00504000` | Polos / Tops |
| **Polo Henley ML** | `00505000` | Polos / Tops |
| **Conjunto Canguro** | `00506000` | Conjuntos |
| **Set Rangla / Set Urbano** | `00507000` | Conjuntos |
| **Pantalón Cargo Fit** | `00508000` | Pantalones / Bottoms |
| **Pantalón Jogguer** | `00509000` | Pantalones / Bottoms |
| **Pantalón Skinny** | `00510000` | Pantalones / Bottoms |
| **Conjunto Tulum** | `00511000` | Conjuntos |
| **Camisa Tulum** | `00512000` | Camisas |
| **Polera Hoodie Classic** | `00513000` | Poleras / Tops |

---
¡El sistema está listo! Base de datos optimizada para escalar a miles de productos con identificación única y automatización AI.
