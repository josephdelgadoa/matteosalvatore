# Arquitectura Técnica - Matteo Salvatore E-commerce

## 1. Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4 + CSS Variables
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **i18n**: next-intl
- **SEO**: next-seo + JSON-LD

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **API**: RESTful + Webhooks
- **Auth**: Supabase Auth + JWT
- **File Upload**: Supabase Storage
- **Email**: Resend API

### Database
- **Primary**: Supabase (PostgreSQL 15)
- **Cache**: Redis (para sesiones y cart)
- **Search**: PostgreSQL Full-Text Search

### AI & Automation
- **LLM**: Google Gemini 2.5 Pro (content generation)
- **Edge AI**: Gemini Nano Banana Pro (product recommendations)
- **Chatbot**: Custom RAG con Gemini + Supabase Vector
- **WhatsApp**: Twilio API + WhatsApp Business

### Payments & Checkout
- **Gateway**: Culqi (Perú)
- **Tax**: IGV 18% automático
- **Currency**: PEN (Nuevos Soles)

### DevOps & Deploy
- **Containerization**: Docker + Docker Compose
- **Hosting**: VPS Hostinger
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (auto-renovable)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Uptime Robot

---

## 2. Arquitectura de Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE                          │
│                    (CDN + DDoS Protection)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    VPS HOSTINGER (Docker)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NGINX (Reverse Proxy + Load Balancer)              │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────┴───────────────────────────────────┐  │
│  │                                                       │  │
│  │  ┌─────────────────┐       ┌─────────────────┐      │  │
│  │  │   Next.js App   │       │   Express API   │      │  │
│  │  │   (Frontend)    │◄─────►│   (Backend)     │      │  │
│  │  │   Port: 3000    │       │   Port: 4000    │      │  │
│  │  └────────┬────────┘       └────────┬────────┘      │  │
│  │           │                         │               │  │
│  │           │         ┌───────────────┘               │  │
│  │           │         │                               │  │
│  │           ▼         ▼                               │  │
│  │  ┌─────────────────────────────────────┐           │  │
│  │  │         Redis Cache                 │           │  │
│  │  │   (Sessions + Cart + Rate Limit)   │           │  │
│  │  └─────────────────────────────────────┘           │  │
│  └───────────────────────────────────────────────────────┘
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Supabase   │  │    Culqi     │  │   Gemini AI  │     │
│  │  (Database)  │  │   (Pagos)    │  │  (Chatbot)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Twilio    │  │    Resend    │  │   Sentry     │     │
│  │  (WhatsApp)  │  │   (Email)    │  │ (Monitoring) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Datos (Supabase)

### 3.1 Tablas Principales

#### `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name_es VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description_es TEXT,
  description_en TEXT,
  category VARCHAR(50) NOT NULL, -- 'clothing', 'footwear'
  subcategory VARCHAR(50), -- 'pants', 'polos', 'hoodies', 'sneakers'
  base_price DECIMAL(10,2) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title_es VARCHAR(60),
  seo_title_en VARCHAR(60),
  seo_description_es VARCHAR(160),
  seo_description_en VARCHAR(160),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
```

#### `product_variants`
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10), -- 'S', 'M', 'L', 'XL', '39', '40', '41', '42', '43'
  color VARCHAR(50), -- 'blanco', 'negro', 'azul', 'beige', 'rojo'
  color_hex VARCHAR(7), -- '#FFFFFF', '#000000', etc.
  sku_variant VARCHAR(50) UNIQUE NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  additional_price DECIMAL(10,2) DEFAULT 0, -- precio adicional por variante
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku_variant);
```

#### `product_images`
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  alt_text_es VARCHAR(255),
  alt_text_en VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_images_product ON product_images(product_id);
```

#### `customers`
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  document_type VARCHAR(10), -- 'DNI', 'CE', 'RUC'
  document_number VARCHAR(20),
  password_hash TEXT, -- bcrypt hash
  is_verified BOOLEAN DEFAULT false,
  language_preference VARCHAR(2) DEFAULT 'es', -- 'es', 'en'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
```

#### `addresses`
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50), -- 'Casa', 'Oficina', 'Otro'
  street_address VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Lima',
  region VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10),
  country VARCHAR(2) DEFAULT 'PE',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);
```

#### `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- 'MS-20250204-0001'
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', 
  -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  
  -- Totales
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL, -- IGV 18%
  shipping_cost DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PEN',
  
  -- Shipping
  shipping_first_name VARCHAR(100),
  shipping_last_name VARCHAR(100),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_district VARCHAR(100),
  shipping_city VARCHAR(100),
  shipping_region VARCHAR(100),
  
  -- Billing (si es empresa)
  billing_company_name VARCHAR(255),
  billing_ruc VARCHAR(20),
  billing_address TEXT,
  
  -- Tracking
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  language VARCHAR(2) DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name VARCHAR(255) NOT NULL,
  variant_details VARCHAR(100), -- 'Talla: M, Color: Negro'
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

#### `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  culqi_charge_id VARCHAR(100) UNIQUE,
  payment_method VARCHAR(20), -- 'card', 'yape', 'plin'
  card_brand VARCHAR(20), -- 'visa', 'mastercard', 'amex'
  card_last_four VARCHAR(4),
  status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PEN',
  culqi_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_culqi ON payments(culqi_charge_id);
```

#### `cart`
```sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_cart_customer ON cart(customer_id);
```

#### `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(100),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
```

#### `chatbot_conversations`
```sql
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  context JSONB, -- información del cart, usuario, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chatbot_session ON chatbot_conversations(session_id);
```

#### `seo_metadata`
```sql
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type VARCHAR(50) NOT NULL, -- 'home', 'category', 'product', 'custom'
  slug VARCHAR(255),
  title_es VARCHAR(60),
  title_en VARCHAR(60),
  description_es VARCHAR(160),
  description_en VARCHAR(160),
  keywords_es TEXT[],
  keywords_en TEXT[],
  og_image_url TEXT,
  schema_markup JSONB,
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_seo_page_slug ON seo_metadata(page_type, slug);
```

### 3.2 Funciones y Triggers

```sql
-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calcular IGV automáticamente
CREATE OR REPLACE FUNCTION calculate_order_tax()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tax_amount = ROUND(NEW.subtotal * 0.18, 2);
  NEW.total_amount = NEW.subtotal + NEW.tax_amount + NEW.shipping_cost - COALESCE(NEW.discount_amount, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_tax_on_order BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION calculate_order_tax();

-- Generar número de orden automático
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_part VARCHAR(8);
  sequence_number INTEGER;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  SELECT COUNT(*) + 1 INTO sequence_number
  FROM orders
  WHERE order_number LIKE 'MS-' || date_part || '-%';
  
  NEW.order_number := 'MS-' || date_part || '-' || LPAD(sequence_number::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

---

## 4. API Endpoints (Backend Express)

### 4.1 Products
- `GET /api/products` - Listar productos con filtros
- `GET /api/products/:slug` - Detalle de producto
- `GET /api/products/:id/variants` - Variantes de producto
- `GET /api/products/:id/reviews` - Reviews de producto

### 4.2 Cart
- `POST /api/cart/add` - Agregar item al carrito
- `PUT /api/cart/update/:itemId` - Actualizar cantidad
- `DELETE /api/cart/remove/:itemId` - Remover item
- `GET /api/cart` - Obtener carrito actual
- `DELETE /api/cart/clear` - Vaciar carrito

### 4.3 Checkout
- `POST /api/checkout/calculate` - Calcular totales con IGV
- `POST /api/checkout/create-order` - Crear orden
- `POST /api/checkout/culqi-token` - Generar token Culqi
- `POST /api/checkout/process-payment` - Procesar pago
- `POST /api/webhooks/culqi` - Webhook de Culqi

### 4.4 Orders
- `GET /api/orders/:orderNumber` - Detalle de orden
- `GET /api/customers/:customerId/orders` - Órdenes del cliente
- `PUT /api/orders/:id/status` - Actualizar estado (admin)

### 4.5 AI & Automation
- `POST /api/chatbot/message` - Enviar mensaje al chatbot
- `POST /api/ai/product-recommendations` - Recomendaciones personalizadas
- `POST /api/ai/generate-content` - Generar contenido con Gemini
- `POST /api/whatsapp/send-confirmation` - Enviar confirmación por WhatsApp

### 4.6 Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `GET /api/auth/verify-email/:token` - Verificar email

---

## 5. Integración Culqi (Pagos)

### 5.1 Flujo de Pago

```
1. Cliente → Frontend (Formulario de pago)
2. Frontend → Culqi.js (Genera token seguro)
3. Frontend → Backend (/api/checkout/process-payment)
4. Backend → Culqi API (Crea cargo)
5. Culqi API → Backend (Respuesta)
6. Backend → Database (Guarda payment + actualiza order status)
7. Backend → WhatsApp API (Confirmación automática)
8. Backend → Frontend (Success/Error)
```

### 5.2 Configuración Culqi

```javascript
// Backend: config/culqi.js
const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;
const CULQI_PUBLIC_KEY = process.env.CULQI_PUBLIC_KEY;

const culqiConfig = {
  baseUrl: 'https://api.culqi.com/v2',
  headers: {
    'Authorization': `Bearer ${CULQI_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
};
```

### 5.3 Implementación Backend

```javascript
// controllers/paymentController.js
const createCharge = async (req, res) => {
  const { token, order_id, amount, email } = req.body;
  
  try {
    const order = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();
    
    const charge = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: culqiConfig.headers,
      body: JSON.stringify({
        amount: Math.round(order.total_amount * 100), // en centavos
        currency_code: 'PEN',
        email: email,
        source_id: token,
        description: `Orden ${order.order_number}`,
        metadata: {
          order_number: order.order_number,
          customer_id: order.customer_id
        }
      })
    });
    
    const chargeData = await charge.json();
    
    if (chargeData.object === 'charge') {
      // Pago exitoso
      await supabase.from('payments').insert({
        order_id: order.id,
        culqi_charge_id: chargeData.id,
        payment_method: 'card',
        card_brand: chargeData.source.card_brand,
        card_last_four: chargeData.source.card_number,
        status: 'completed',
        amount: order.total_amount,
        culqi_response: chargeData,
        paid_at: new Date()
      });
      
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order.id);
      
      // Enviar confirmación por WhatsApp
      await sendWhatsAppConfirmation(order);
      
      return res.json({ success: true, charge: chargeData });
    } else {
      // Pago fallido
      return res.status(400).json({ success: false, error: chargeData });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 6. Automatización WhatsApp

### 6.1 Configuración Twilio

```javascript
// services/whatsapp.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppConfirmation = async (order) => {
  const message = `
🎉 *¡Gracias por tu compra en Matteo Salvatore!*

📦 *Orden:* ${order.order_number}
💰 *Total:* S/ ${order.total_amount.toFixed(2)}
📍 *Envío:* ${order.shipping_address}

Recibirás tu pedido en 2-3 días hábiles.

📲 Rastrea tu pedido: https://matteosalvatore.pe/orders/${order.order_number}

_Equipo Matteo Salvatore_
  `.trim();
  
  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio Sandbox
      to: `whatsapp:+51${order.shipping_phone}`,
      body: message
    });
    console.log(`WhatsApp sent to ${order.shipping_phone}`);
  } catch (error) {
    console.error('WhatsApp error:', error);
  }
};
```

### 6.2 Templates de Mensajes

**Confirmación de Pedido:**
```
🎉 ¡Gracias por tu compra!
Orden: MS-20250204-0001
Total: S/ 350.00
Envío: Av. San Borja Norte 524
Entrega: 2-3 días hábiles
```

**Pedido Enviado:**
```
📦 Tu pedido está en camino
Tracking: OLVA-12345
Fecha estimada: 06/02/2025
Rastrea aquí: [link]
```

**Pedido Entregado:**
```
✅ Pedido entregado
¿Cómo estuvo tu experiencia?
Déjanos tu reseña: [link]
```

---

## 7. Chatbot con IA (Gemini)

### 7.1 Arquitectura RAG

```javascript
// services/chatbot.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatbot = async (userMessage, context) => {
  // 1. Recuperar información relevante del catálogo
  const products = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true);
  
  // 2. Preparar contexto
  const systemPrompt = `
Eres un asistente virtual de Matteo Salvatore, marca premium de ropa masculina en Perú.

INFORMACIÓN DE LA MARCA:
- Dominio: matteosalvatore.pe
- Ubicación: Av. San Borja Norte 524, San Borja, Lima
- Especialidad: Ropa y calzado premium para hombres
- Estilo: Minimalista, moderno, alta calidad

CATÁLOGO:
${JSON.stringify(products.data, null, 2)}

POLÍTICAS:
- Envíos a todo el Perú (2-3 días hábiles)
- Cambios y devoluciones: 30 días
- Pago seguro con Culqi (tarjetas Visa, Mastercard, American Express)
- Precios en Nuevos Soles (PEN) con IGV incluido

INSTRUCCIONES:
- Sé amable, profesional y conciso
- Recomienda productos según las preferencias del cliente
- Menciona tallas disponibles (S, M, L, XL)
- Si preguntan por stock, verifica las variantes
- Invita a visitar la tienda física si están en Lima
- Responde en el idioma del cliente (ES/EN)

CONTEXTO DEL USUARIO:
${JSON.stringify(context, null, 2)}
  `.trim();
  
  // 3. Generar respuesta con Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  
  const chat = model.startChat({
    history: context.history || [],
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
  });
  
  const result = await chat.sendMessage(userMessage);
  const response = result.response.text();
  
  // 4. Guardar conversación
  await supabase
    .from('chatbot_conversations')
    .upsert({
      session_id: context.sessionId,
      customer_id: context.customerId,
      messages: [
        ...(context.history || []),
        { role: 'user', content: userMessage, timestamp: new Date() },
        { role: 'assistant', content: response, timestamp: new Date() }
      ],
      context: context
    });
  
  return response;
};
```

### 7.2 Endpoints del Chatbot

```javascript
// routes/chatbot.js
router.post('/api/chatbot/message', async (req, res) => {
  const { message, sessionId, customerId, cartItems } = req.body;
  
  const context = {
    sessionId,
    customerId,
    cartItems,
    timestamp: new Date(),
    language: req.headers['accept-language']?.includes('es') ? 'es' : 'en'
  };
  
  const response = await chatbot(message, context);
  
  res.json({ response, sessionId });
});
```

---

## 8. SEO & GEO Strategy

### 8.1 Metadatos Base (Next.js)

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://matteosalvatore.pe'),
  title: {
    default: 'Matteo Salvatore | Ropa Premium para Hombres',
    template: '%s | Matteo Salvatore'
  },
  description: 'Descubre la colección de ropa y calzado premium para hombres. Diseño minimalista, alta calidad, fabricado en Perú.',
  keywords: ['ropa premium hombre', 'moda masculina perú', 'calzado cuero peruano', 'ropa minimalista', 'matteo salvatore'],
  authors: [{ name: 'Matteo Salvatore' }],
  creator: 'Inversiones Matteo Salvatore SAC',
  publisher: 'Matteo Salvatore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://matteosalvatore.pe',
    siteName: 'Matteo Salvatore',
    title: 'Matteo Salvatore | Ropa Premium para Hombres',
    description: 'Descubre la colección de ropa y calzado premium para hombres',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Matteo Salvatore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matteo Salvatore | Ropa Premium para Hombres',
    description: 'Descubre la colección de ropa y calzado premium para hombres',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-google-search-console',
  },
};
```

### 8.2 JSON-LD Schema (Product Page)

```typescript
// components/ProductSchema.tsx
const ProductSchema = ({ product, variant }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_es,
    description: product.description_es,
    image: product.images.map(img => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Matteo Salvatore'
    },
    offers: {
      '@type': 'Offer',
      price: product.base_price,
      priceCurrency: 'PEN',
      availability: variant.stock_quantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Inversiones Matteo Salvatore SAC'
      }
    },
    aggregateRating: product.reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviews.length
    } : undefined
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

### 8.3 Sitemap Dinámico

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true);
  
  const productUrls = products.data?.map(product => ({
    url: `https://matteosalvatore.pe/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];
  
  return [
    {
      url: 'https://matteosalvatore.pe',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://matteosalvatore.pe/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
```

---

## 9. Docker Configuration

### 9.1 Dockerfile (Frontend)

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 9.2 Dockerfile (Backend)

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]
```

### 9.3 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/certbot:/var/www/certbot
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=https://matteosalvatore.pe/api
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_CULQI_PUBLIC_KEY=${CULQI_PUBLIC_KEY}
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=4000
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - CULQI_SECRET_KEY=${CULQI_SECRET_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    volumes:
      - ./nginx/ssl:/etc/letsencrypt
      - ./nginx/certbot:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  redis_data:
```

### 9.4 Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:4000;
    }

    server {
        listen 80;
        server_name matteosalvatore.pe www.matteosalvatore.pe;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name matteosalvatore.pe www.matteosalvatore.pe;

        ssl_certificate /etc/nginx/ssl/live/matteosalvatore.pe/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/live/matteosalvatore.pe/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets caching
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
            proxy_pass http://frontend;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 10. Variables de Entorno

```bash
# .env.example

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Culqi
CULQI_PUBLIC_KEY=pk_test_xxxxx
CULQI_SECRET_KEY=sk_test_xxxxx

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Redis
REDIS_URL=redis://redis:6379

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# App
NODE_ENV=production
FRONTEND_URL=https://matteosalvatore.pe
API_URL=https://matteosalvatore.pe/api
```

---

## 11. Roadmap de Implementación

### Fase 0: Setup (Semana 1)
- [ ] Configurar repositorio Git
- [ ] Configurar Supabase proyecto
- [ ] Crear estructura de carpetas
- [ ] Instalar dependencias base
- [ ] Configurar Docker local

### Fase 1: MVP (Semanas 2-4)
- [ ] Modelo de datos completo
- [ ] Frontend: Home + Catálogo + Producto
- [ ] Backend: API productos + cart
- [ ] Checkout básico (sin pagos)
- [ ] Deploy en VPS

### Fase 2: Pagos & Automatización (Semanas 5-6)
- [ ] Integración Culqi completa
- [ ] WhatsApp confirmaciones
- [ ] Sistema de órdenes
- [ ] Panel de admin básico

### Fase 3: IA & Optimización (Semanas 7-8)
- [ ] Chatbot con Gemini
- [ ] Recomendaciones personalizadas
- [ ] SEO completo + sitemap
- [ ] Optimización performance

### Fase 4: Escalamiento (Semanas 9-12)
- [ ] Sistema de reviews
- [ ] Dashboard analytics
- [ ] A/B testing
- [ ] Marketing automation
- [ ] Mobile app (PWA)

---

## 12. Monitoring & Observability

```javascript
// services/monitoring.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Log importante eventos
const logEvent = (eventType, data) => {
  console.log(`[${new Date().toISOString()}] ${eventType}:`, data);
  
  // Enviar a Sentry si es error
  if (eventType.includes('ERROR')) {
    Sentry.captureException(new Error(eventType), {
      extra: data
    });
  }
};
```

---

**Siguiente paso:** ¿Quieres que proceda con el diseño UX/UI y el código del frontend?
