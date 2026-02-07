# Sistema de Diseño - Matteo Salvatore

## 1. Filosofía de Diseño

**CONCEPTO:** "Minimal Luxury" — Elegancia sin esfuerzo, lujo discreto, masculinidad refinada.

**KEYWORDS:** 
- Minimalista pero sofisticado
- Espacios generosos
- Tipografía premium
- Texturas sutiles
- Interacciones elegantes
- High-end fashion aesthetic

**REFERENCIAS VISUALES:**
- Acne Studios (minimalismo escandinavo)
- Our Legacy (texturas sutiles)
- The Row (lujo discreto)
- APC (clean premium)

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
  --ms-brand-primary: #1A1A1A; /* Negro profundo */
  --ms-brand-accent: #8B7355; /* Café italiano (leather tone) */
  
  /* Product Colors */
  --ms-color-blanco: #FAFAFA;
  --ms-color-negro: #0F0F0F;
  --ms-color-azul: #2C3E50;
  --ms-color-beige: #D4C4B0;
  --ms-color-rojo: #A63446;
  
  /* Semantic Colors */
  --ms-success: #2D5F2E;
  --ms-error: #C1292E;
  --ms-warning: #D97706;
  --ms-info: #0369A1;
}
```

### 2.2 Uso de Color

- **Fondo principal:** `--ms-ivory` o `--ms-white`
- **Texto primario:** `--ms-black`
- **Texto secundario:** `--ms-stone`
- **Bordes sutiles:** `--ms-fog`
- **Hover states:** `--ms-brand-accent`
- **CTAs principales:** `--ms-black` con hover a `--ms-charcoal`

---

## 3. Typography System

### 3.1 Fuentes

**Display Font (Headings):**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
```
- Elegante, serif clásica
- Para títulos grandes, hero sections, product names
- Weights: 300 (Light), 400 (Regular), 600 (SemiBold)

**Body Font:**
```css
@import url('https://fonts.googleapis.com/css2?family=Untitled+Sans:wght@300;400;500;600&display=swap');
```
Fallback si Untitled Sans no está disponible:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
```
- Clean, moderna, legible
- Para body text, UI elements, navigation
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)

### 3.2 Type Scale

```css
:root {
  /* Type Scale */
  --ms-text-xs: 0.75rem;      /* 12px */
  --ms-text-sm: 0.875rem;     /* 14px */
  --ms-text-base: 1rem;       /* 16px */
  --ms-text-lg: 1.125rem;     /* 18px */
  --ms-text-xl: 1.25rem;      /* 20px */
  --ms-text-2xl: 1.5rem;      /* 24px */
  --ms-text-3xl: 1.875rem;    /* 30px */
  --ms-text-4xl: 2.25rem;     /* 36px */
  --ms-text-5xl: 3rem;        /* 48px */
  --ms-text-6xl: 3.75rem;     /* 60px */
  --ms-text-7xl: 4.5rem;      /* 72px */
  
  /* Line Heights */
  --ms-leading-tight: 1.15;
  --ms-leading-snug: 1.25;
  --ms-leading-normal: 1.5;
  --ms-leading-relaxed: 1.75;
  
  /* Letter Spacing */
  --ms-tracking-tighter: -0.05em;
  --ms-tracking-tight: -0.025em;
  --ms-tracking-normal: 0;
  --ms-tracking-wide: 0.025em;
  --ms-tracking-wider: 0.05em;
  --ms-tracking-widest: 0.1em;
}
```

### 3.3 Typography Classes

```css
.ms-heading-hero {
  font-family: 'Cormorant Garamond', serif;
  font-size: var(--ms-text-7xl);
  font-weight: 300;
  line-height: var(--ms-leading-tight);
  letter-spacing: var(--ms-tracking-tighter);
  color: var(--ms-black);
}

.ms-heading-1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: var(--ms-text-5xl);
  font-weight: 400;
  line-height: var(--ms-leading-tight);
  letter-spacing: var(--ms-tracking-tight);
}

.ms-heading-2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: var(--ms-text-4xl);
  font-weight: 400;
  line-height: var(--ms-leading-snug);
}

.ms-heading-3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: var(--ms-text-3xl);
  font-weight: 400;
  line-height: var(--ms-leading-snug);
}

.ms-body-large {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-lg);
  font-weight: 400;
  line-height: var(--ms-leading-relaxed);
  letter-spacing: var(--ms-tracking-normal);
}

.ms-body {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-base);
  font-weight: 400;
  line-height: var(--ms-leading-normal);
}

.ms-body-small {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-sm);
  font-weight: 400;
  line-height: var(--ms-leading-normal);
}

.ms-label {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--ms-tracking-wider);
}

.ms-caption {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-xs);
  font-weight: 400;
  color: var(--ms-slate);
  letter-spacing: var(--ms-tracking-wide);
}
```

---

## 4. Spacing System

```css
:root {
  --ms-space-1: 0.25rem;   /* 4px */
  --ms-space-2: 0.5rem;    /* 8px */
  --ms-space-3: 0.75rem;   /* 12px */
  --ms-space-4: 1rem;      /* 16px */
  --ms-space-5: 1.25rem;   /* 20px */
  --ms-space-6: 1.5rem;    /* 24px */
  --ms-space-8: 2rem;      /* 32px */
  --ms-space-10: 2.5rem;   /* 40px */
  --ms-space-12: 3rem;     /* 48px */
  --ms-space-16: 4rem;     /* 64px */
  --ms-space-20: 5rem;     /* 80px */
  --ms-space-24: 6rem;     /* 96px */
  --ms-space-32: 8rem;     /* 128px */
  --ms-space-40: 10rem;    /* 160px */
  --ms-space-48: 12rem;    /* 192px */
}
```

**Principios de uso:**
- Mobile: Espacios más compactos (4, 8, 16, 24, 32px)
- Desktop: Espacios generosos (16, 24, 32, 48, 64px)
- Secciones hero: 80-160px vertical spacing
- Entre productos: 24-32px
- Entre elementos UI: 8-16px

---

## 5. Layout Grid

### 5.1 Container System

```css
.ms-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--ms-space-4);
  padding-right: var(--ms-space-4);
}

@media (min-width: 640px) {
  .ms-container {
    max-width: 640px;
    padding-left: var(--ms-space-6);
    padding-right: var(--ms-space-6);
  }
}

@media (min-width: 768px) {
  .ms-container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .ms-container {
    max-width: 1024px;
    padding-left: var(--ms-space-8);
    padding-right: var(--ms-space-8);
  }
}

@media (min-width: 1280px) {
  .ms-container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .ms-container {
    max-width: 1440px; /* Max width para no perder elegancia en pantallas muy grandes */
  }
}
```

### 5.2 Grid System

```css
.ms-grid {
  display: grid;
  gap: var(--ms-space-6);
}

/* Product Grid - 2 columnas mobile, 3 desktop, 4 en XL */
.ms-product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ms-space-6);
}

@media (min-width: 768px) {
  .ms-product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ms-space-8);
  }
}

@media (min-width: 1280px) {
  .ms-product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Hero Grid - Asimétrico */
.ms-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ms-space-8);
}

@media (min-width: 1024px) {
  .ms-hero-grid {
    grid-template-columns: 1.2fr 1fr;
    gap: var(--ms-space-16);
  }
}
```

---

## 6. Component Tokens

### 6.1 Buttons

```css
/* Primary Button */
.ms-btn-primary {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--ms-tracking-wider);
  
  padding: var(--ms-space-4) var(--ms-space-8);
  
  background-color: var(--ms-black);
  color: var(--ms-white);
  border: 1px solid var(--ms-black);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.ms-btn-primary:hover {
  background-color: var(--ms-charcoal);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Secondary Button */
.ms-btn-secondary {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--ms-tracking-wider);
  
  padding: var(--ms-space-4) var(--ms-space-8);
  
  background-color: transparent;
  color: var(--ms-black);
  border: 1px solid var(--ms-black);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.ms-btn-secondary:hover {
  background-color: var(--ms-black);
  color: var(--ms-white);
}

/* Text Button */
.ms-btn-text {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-sm);
  font-weight: 500;
  letter-spacing: var(--ms-tracking-wide);
  
  padding: var(--ms-space-2) 0;
  
  background: transparent;
  color: var(--ms-stone);
  border: none;
  border-bottom: 1px solid transparent;
  
  transition: all 0.25s ease;
  cursor: pointer;
}

.ms-btn-text:hover {
  color: var(--ms-black);
  border-bottom-color: var(--ms-black);
}
```

### 6.2 Inputs

```css
.ms-input {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-base);
  font-weight: 400;
  
  padding: var(--ms-space-4);
  
  background-color: var(--ms-white);
  color: var(--ms-black);
  border: 1px solid var(--ms-fog);
  
  transition: all 0.2s ease;
}

.ms-input:focus {
  outline: none;
  border-color: var(--ms-black);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
}

.ms-input::placeholder {
  color: var(--ms-silver);
}

/* Input Label */
.ms-label {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--ms-text-sm);
  font-weight: 500;
  color: var(--ms-stone);
  letter-spacing: var(--ms-tracking-wide);
  text-transform: uppercase;
  margin-bottom: var(--ms-space-2);
}
```

### 6.3 Cards

```css
.ms-product-card {
  background: var(--ms-white);
  border: 1px solid var(--ms-fog);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.ms-product-card:hover {
  border-color: var(--ms-silver);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.ms-product-card-image {
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--ms-pearl);
}

.ms-product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.ms-product-card:hover .ms-product-card-image img {
  transform: scale(1.05);
}
```

---

## 7. Animation System

### 7.1 Timing Functions

```css
:root {
  --ms-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ms-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ms-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ms-ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --ms-ease-elegant: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Durations */
  --ms-duration-fast: 150ms;
  --ms-duration-normal: 250ms;
  --ms-duration-slow: 400ms;
  --ms-duration-slower: 600ms;
}
```

### 7.2 Micro-interactions

```css
/* Fade In on Scroll */
@keyframes ms-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ms-fade-in {
  animation: ms-fade-in var(--ms-duration-slow) var(--ms-ease-out);
}

/* Scale on Hover */
.ms-scale-hover {
  transition: transform var(--ms-duration-normal) var(--ms-ease-elegant);
}

.ms-scale-hover:hover {
  transform: scale(1.02);
}

/* Slide In from Left */
@keyframes ms-slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Image Reveal Effect */
.ms-image-reveal {
  position: relative;
  overflow: hidden;
}

.ms-image-reveal::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--ms-ivory);
  z-index: 1;
  animation: ms-reveal 1s var(--ms-ease-elegant) forwards;
}

@keyframes ms-reveal {
  to {
    left: 100%;
  }
}
```

### 7.3 Page Transitions

```css
/* Page Load Stagger */
.ms-stagger-item {
  opacity: 0;
  animation: ms-fade-in var(--ms-duration-slow) var(--ms-ease-out) forwards;
}

.ms-stagger-item:nth-child(1) { animation-delay: 0ms; }
.ms-stagger-item:nth-child(2) { animation-delay: 100ms; }
.ms-stagger-item:nth-child(3) { animation-delay: 200ms; }
.ms-stagger-item:nth-child(4) { animation-delay: 300ms; }
.ms-stagger-item:nth-child(5) { animation-delay: 400ms; }
.ms-stagger-item:nth-child(6) { animation-delay: 500ms; }
```

---

## 8. Elevation System

```css
:root {
  /* Shadows */
  --ms-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --ms-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --ms-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --ms-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --ms-shadow-xl: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Aplicación estratégica */
.ms-card-elevated {
  box-shadow: var(--ms-shadow);
  transition: box-shadow var(--ms-duration-normal) var(--ms-ease-out);
}

.ms-card-elevated:hover {
  box-shadow: var(--ms-shadow-lg);
}
```

---

## 9. Responsive Breakpoints

```css
:root {
  --ms-breakpoint-sm: 640px;
  --ms-breakpoint-md: 768px;
  --ms-breakpoint-lg: 1024px;
  --ms-breakpoint-xl: 1280px;
  --ms-breakpoint-2xl: 1536px;
}
```

**Mobile First Approach:**
```css
/* Base styles: Mobile (default) */
.element {
  font-size: var(--ms-text-sm);
  padding: var(--ms-space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    font-size: var(--ms-text-base);
    padding: var(--ms-space-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: var(--ms-text-lg);
    padding: var(--ms-space-8);
  }
}
```

---

## 10. Iconography

**Icon Library:** Lucide React (clean, minimal, consistent)

```jsx
import { ShoppingBag, User, Search, Menu, Heart, ChevronRight } from 'lucide-react';

// Tamaños estándar
const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40
};

// Uso
<ShoppingBag size={iconSizes.md} strokeWidth={1.5} />
```

**Principios:**
- Stroke weight: 1.5px (delicado pero visible)
- Color: `--ms-stone` por defecto, `--ms-black` en hover
- Size: 20-24px en UI, 32px+ en hero sections

---

## 11. Imagery Guidelines

### 11.1 Product Photography

**Estilo:**
- Fondo blanco/gris claro (`--ms-ivory` o `--ms-pearl`)
- Iluminación suave, natural
- Modelo o flat lay minimalista
- Aspect ratio: 3:4 (vertical) o 1:1 (cuadrado)
- Resolución: mínimo 1200x1600px

**Tratamiento:**
- Filtro: Desaturado suave (-10% saturation)
- Contraste: +5%
- Highlights: suaves, no quemados
- Shadows: profundas pero con detalle

### 11.2 Lifestyle & Editorial

**Estilo:**
- Ambientes minimalistas (interiores limpios, urbanos)
- Luz natural
- Paleta neutral (tonos tierra, grises, blancos)
- Composición asimétrica pero equilibrada

### 11.3 Optimization

```javascript
// Next.js Image component
<Image
  src="/products/example.jpg"
  alt="Product name"
  width={800}
  height={1067}
  quality={85}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

---

## 12. Copy & Microcopy Guidelines

### 12.1 Tono de Voz

**ES:**
- Profesional pero cercano
- Directo, sin floreos
- Aspiracional sin ser pretencioso
- Ejemplo: "Descubre tu estilo" vs "Encuentra tu look perfecto"

**EN:**
- Clean, sophisticated
- Confident but understated
- Example: "Discover your style" vs "Find your perfect look"

### 12.2 CTAs

**Primarios (ES):**
- "Comprar ahora"
- "Agregar al carrito"
- "Ver colección"
- "Explorar"

**Primarios (EN):**
- "Shop now"
- "Add to cart"
- "View collection"
- "Explore"

**Secundarios (ES):**
- "Ver más"
- "Detalles"
- "Guía de tallas"
- "Envío gratis"

**Secundarios (EN):**
- "View more"
- "Details"
- "Size guide"
- "Free shipping"

---

## 13. Accessibility Standards

### 13.1 Color Contrast

- Texto sobre fondo claro: mínimo 4.5:1 (WCAG AA)
- Texto grande (18px+): mínimo 3:1
- Elementos interactivos: mínimo 3:1

**Verificación:**
```css
/* ✅ GOOD */
.text-on-light {
  color: var(--ms-black); /* #0A0A0A on #FFFFFF = 20:1 */
}

/* ✅ GOOD */
.text-secondary {
  color: var(--ms-stone); /* #4A4A4A on #FFFFFF = 8.6:1 */
}

/* ⚠️ BORDER */
.text-light {
  color: var(--ms-slate); /* #737373 on #FFFFFF = 4.6:1 - OK para texto grande */
}
```

### 13.2 Focus States

```css
*:focus-visible {
  outline: 2px solid var(--ms-black);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--ms-brand-accent);
  outline-offset: 3px;
}
```

### 13.3 ARIA Labels

```jsx
<button aria-label="Agregar al carrito">
  <ShoppingBag />
</button>

<nav aria-label="Navegación principal">
  {/* ... */}
</nav>

<img 
  src="/product.jpg" 
  alt="Polo de algodón pima color negro, talla M" 
/>
```

---

## 14. Dark Mode (Opcional - Fase 2)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --ms-background: var(--ms-charcoal);
    --ms-surface: var(--ms-graphite);
    --ms-text-primary: var(--ms-ivory);
    --ms-text-secondary: var(--ms-silver);
    --ms-border: var(--ms-stone);
  }
}
```

---

## 15. Performance Guidelines

### 15.1 Critical CSS

Inline crítico en `<head>`:
- Typography tokens
- Color tokens
- Layout containers
- Above-the-fold styles

### 15.2 Font Loading

```css
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url('/fonts/cormorant-garamond.woff2') format('woff2');
}

@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url('/fonts/dm-sans.woff2') format('woff2');
}
```

### 15.3 Image Optimization

- WebP con fallback JPEG
- Lazy loading (excepto hero)
- Responsive images con `srcset`
- Blur placeholder

---

## 16. Component Library Checklist

- [ ] Button (Primary, Secondary, Text, Icon)
- [ ] Input (Text, Email, Tel, Textarea, Select)
- [ ] Card (Product, Review, Blog)
- [ ] Navigation (Header, Footer, Mobile Menu)
- [ ] Product Grid
- [ ] Product Card
- [ ] Product Gallery (Carousel + Thumbnails)
- [ ] Cart Drawer
- [ ] Modal (Quick View, Size Guide)
- [ ] Badge (New, Sale, Low Stock)
- [ ] Loading States (Skeleton, Spinner)
- [ ] Notification (Toast, Alert)
- [ ] Breadcrumbs
- [ ] Tabs
- [ ] Accordion
- [ ] Pagination
- [ ] Filter Sidebar
- [ ] Search Bar
- [ ] Language Switcher
- [ ] Chatbot Widget

---

**Siguiente paso:** Implementar los componentes React/Next.js con este sistema de diseño.
