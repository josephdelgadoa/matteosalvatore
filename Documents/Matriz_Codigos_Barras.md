# Guía de Implementación: Matriz de Códigos de Barras (Actualizado Marzo 2026)

Este documento es la "Fuente de Verdad" para la creación de nuevos productos y la gestión de inventario en Matteo Salvatore.

## 🚀 Estado Actual del Sistema
> [!IMPORTANT]
> **Full Reset Ejecutado (19 Marzo 2026):** Se ha realizado un reinicio total de la base de datos. El catálogo está vacío y listo para recibir nuevos productos desde cero siguiendo esta estructura.

## Cambios Implementados

### 1. Esquema de Base de Datos & Admin
- **Nuevas Columnas:** Se añadieron `barcode` y `sku_variant` a la tabla `product_variants`. Ambos campos son **idénticos y puramente numéricos** para mayor simplicidad.
- **Búsqueda Avanzada:** El panel de administración permite buscar por **Código de Estilo**, Barcode o Categoría.
- **Elite AI Ready:** Integración con Gemini 2.5 Flash para generación de metadatos SEO y descripciones de lujo.

### 2. Lógica de la Matriz de Códigos de Barras
Implementamos una matriz de 3 partes para cada variante:
- **Prefijo de Estilo (8 dígitos):** Identificador base del producto.
- **Identidad de Color (2 dígitos):** ID único basado en la tabla oficial.
- **Identidad de Talla (1 dígito):** ID único para tallas.

**Fórmula de Barcode:** `[Estilo_8][Color_2][Talla_1]` (Total: 11 dígitos numéricos).

---

## 🎨 Referencia de Identidades de Color (24 Colores Oficiales)
| ID | Color | ID | Color |
| :--- | :--- | :--- | :--- |
| **01** | ARENA | **13** | NEGRO |
| **02** | AZUL | **14** | PALO ROSA |
| **03** | AZUL MARINO | **15** | PLOMO |
| **04** | AZUL NOCHE | **16** | PLOMO PLATA |
| **05** | BEIGE | **17** | PLOMO RATA |
| **06** | BLANCO | **18** | ROJO |
| **07** | CAMELL | **19** | ROSADO BEBÉ |
| **08** | CELESTE BEBÉ | **20** | SKY |
| **09** | CEMENTO | **21** | TURQUESA |
| **10** | CREMA | **22** | VERDE |
| **11** | HUESO | **23** | VERDE BOTELLA |
| **12** | MELANGE | **24** | VINO |

---

## 📏 Mapeo de Tallas
| Talla | ID | Talla | ID |
| :--- | :--- | :--- | :--- |
| **XS / 28** | 0 | **XL / 36** | 4 |
| **S / 30** | 1 | **XXL / 38** | 5 |
| **M / 32** | 2 | **40** | 6 |
| **L / 34** | 3 | | |

---

## 🏷️ Mapeo de Estilos (Prefijos)
| Estilo | Prefijo | Categoría Sugerida |
| :--- | :--- | :--- |
| **POLO PIMA BASICO** | `00501000` | Polos / Tops |
| **POLO OVERSIZE** | `00502000` | Polos / Tops |
| **POLO BOXI** | `00503000` | Polos / Tops |
| **POLO HENLEY MANGA CORTA** | `00504000` | Polos / Tops |
| **POLO HENLEY MANGA LARGA** | `00505000` | Polos / Tops |
| **CONJUNTO CANGURO** | `00506000` | Conjuntos |
| **CONJUNTO RAGLAN** | `00507000` | Conjuntos |
| **PANTALON CARGO FIT** | `00508000` | Pantalones |
| **PANTALON JOGGUER** | `00509000` | Pantalones |
| **PANTALON SKINNY** | `00510000` | Pantalones |
| **CONJUNTO TULUM** | `00511000` | Conjuntos |
| **CAMISA TULUM** | `00512000` | Camisas |
| **POLERA HOODIE CLASSIC** | `00513000` | Poleras |

---
¡El sistema está listo! Base de datos optimizada para escalar a miles de productos con identificación única y automatización AI.
