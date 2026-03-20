# Sistema de Diseño - Matteo Salvatore (Actualizado Marzo 2026)

## 1. Filosofía de Diseño

**CONCEPTO:** "Minimal Luxury" — Elegancia sin esfuerzo, lujo discreto, masculinidad refinada.

**KEYWORDS:** 
- Minimalista pero sofisticado
- Espacios generosos
- Tipografía premium
- Texturas sutiles
- Interacciones elegantes
- High-end fashion aesthetic
- Elite AI Integration (New 2026)

---

## 2. Color System

### 2.1 Paleta Principal

```css
:root {
  /* Neutrals - Base del sistema */
  --ms-black: #0A0A0A;
  --ms-charcoal: #1A1A1A;
  --ms-graphite: #2D2D2D;
  --ms-stone: #4A4A4A;
  --ms-slate: #737373;
  --ms-silver: #A8A8A8;
  --ms-fog: #D4D4D4;
  --ms-pearl: #EDEDED;
  --ms-ivory: #F7F7F7;
  --ms-white: #FFFFFF;

  /* Brand Colors */
  --ms-brand-primary: #1A1A1A; 
  --ms-brand-accent: #8B7355; 
  
  /* AI Aesthetic (New 2026) */
  --ms-ai-gradient: linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%);
  --ms-ai-sparkle: #C5A059;
}
```

---

## 3. Admin UI Components (New 2026)

### 3.1 Advanced DataTable
- **Columnas Logísticas**: Inclusión obligatoria de "Código de Estilo" (Style Code) para rastreo rápido.
- **Microcopy**: Uso de "Limpiar" para resetear filtros y "Buscar" con placeholders contextuales.

### 3.2 Intelligent Search Bar
- **UX**: Búsqueda en tiempo real (debounce) que filtra por Nombre, Código de Estilo y Categoría.
- **Visual**: Input refinado con ícono de `Search` a la izquierda y `X` (Clear) a la derecha cuando hay contenido.

### 3.3 Elite AI Marketing Kit
- **Visual Container**: Bordes sutiles con gradiente `--ms-ai-gradient` o fondos tenues `ms-brand-primary/5`.
- **Iconografía**: Uso de `Sparkles` de Lucide para denotar contenido generado por IA.
- **Hierarchy**: División clara entre Social Assets, SEO Meta, y Visual Directives.

---

## 4. Typography System

**Display Font (Headings):** Cormorant Garamond
**Body Font:** Inter / Outfit (Modern sans-serif)

---

## 5. Spacing & Layout

- **Admin Grid**: Layout de 12 columnas para dashboard.
- **Forms**: Secciones agrupadas por `section` con bordes `ms-fog` y títulos `ms-heading-3` para mayor claridad.

---
¡The Matteo Salvatore Design System is built for global dominance and AI efficiency!
!El Sistema de Diseño de Matteo Salvatore está construido para la dominancia global y la eficiencia AI!
