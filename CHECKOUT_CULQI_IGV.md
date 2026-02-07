# Checkout Flow con Culqi + IGV - Matteo Salvatore

## 1. Flujo Completo de Checkout

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKOUT PROCESS                             │
└─────────────────────────────────────────────────────────────────┘

Step 1: CART
├── User reviews items
├── Calculates subtotal
├── Shows estimated shipping
├── Shows IGV (18%) preview
└── Click "Proceed to Checkout"

Step 2: CUSTOMER INFORMATION
├── Email (required)
├── Phone (optional for guest)
├── Guest checkout OR Login/Register
└── Click "Continue to Shipping"

Step 3: SHIPPING ADDRESS
├── Full Name
├── Phone
├── Address Line 1
├── District (Dropdown con distritos de Lima + provincias)
├── City (default: Lima)
├── Region (Dropdown: Lima, Arequipa, Cusco, etc.)
├── Postal Code (optional)
└── Click "Continue to Shipping Method"

Step 4: SHIPPING METHOD
├── Calculate shipping cost based on district/region
│   - Lima Metropolitana: FREE
│   - Provinces: S/ 20.00
├── Select delivery speed:
│   - Standard (2-3 days): Base price
│   - Express (1 day): +S/ 15.00 (Lima only)
└── Click "Continue to Payment"

Step 5: PAYMENT
├── Display Order Summary with final totals
├── Culqi.js integration
├── Card details input
├── Generate Culqi token (frontend)
├── Send token + order to backend
├── Backend creates charge with Culqi
├── Handle 3D Secure if needed
└── Order confirmed

Step 6: CONFIRMATION
├── Display order number
├── Show delivery estimate
├── Send email confirmation
├── Send WhatsApp confirmation
└── Redirect to order tracking
```

---

## 2. Cálculo de Totales con IGV

### 2.1 Lógica de Cálculo

```javascript
// utils/calculations.js

const IGV_RATE = 0.18; // 18%

export const calculateOrderTotals = (cartItems, shippingCost = 0, discountAmount = 0) => {
  // 1. Calcular subtotal (suma de productos)
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.base_price + (item.variant.additional_price || 0);
    return total + (itemPrice * item.quantity);
  }, 0);
  
  // 2. Calcular IGV (sobre subtotal + shipping)
  const taxableAmount = subtotal + shippingCost - discountAmount;
  const taxAmount = taxableAmount * IGV_RATE;
  
  // 3. Calcular total final
  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingCost: Number(shippingCost.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    currency: 'PEN'
  };
};

// Ejemplo de uso:
const cartItems = [
  {
    product: { base_price: 129.00 },
    variant: { additional_price: 0 },
    quantity: 2
  },
  {
    product: { base_price: 299.00 },
    variant: { additional_price: 20.00 },
    quantity: 1
  }
];

const totals = calculateOrderTotals(cartItems, 0, 0);
/*
{
  subtotal: 557.00,
  shippingCost: 0.00,
  discountAmount: 0.00,
  taxAmount: 100.26,  // 18% de 557.00
  totalAmount: 657.26,
  currency: 'PEN'
}
*/
```

### 2.2 Shipping Cost Logic

```javascript
// utils/shipping.js

const DISTRICTS_LIMA = [
  'San Borja', 'Miraflores', 'San Isidro', 'Surco', 'La Molina',
  'Barranco', 'Chorrillos', 'Jesús María', 'Lince', 'Magdalena',
  'Pueblo Libre', 'San Miguel', 'Surquillo', 'Cercado de Lima',
  // ... más distritos de Lima
];

const REGIONS_PERU = [
  'Lima', 'Arequipa', 'Cusco', 'Piura', 'La Libertad', 'Lambayeque',
  'Junín', 'Ica', 'Ayacucho', 'Puno', 'Tacna', 'Tumbes',
  // ... todas las regiones
];

export const calculateShippingCost = (district, region, shippingMethod = 'standard') => {
  let baseCost = 0;
  
  // Lima Metropolitana: FREE
  if (region === 'Lima' && DISTRICTS_LIMA.includes(district)) {
    baseCost = 0;
  } 
  // Provincias: S/ 20.00
  else {
    baseCost = 20.00;
  }
  
  // Express shipping (only in Lima)
  if (shippingMethod === 'express' && region === 'Lima') {
    baseCost += 15.00;
  }
  
  return baseCost;
};

// Ejemplo:
calculateShippingCost('San Borja', 'Lima', 'standard'); // 0.00
calculateShippingCost('San Borja', 'Lima', 'express');  // 15.00
calculateShippingCost('Arequipa', 'Arequipa', 'standard'); // 20.00
```

---

## 3. Integración con Culqi

### 3.1 Frontend Setup (Next.js)

```typescript
// app/checkout/payment/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Culqi: any;
  }
}

export default function PaymentPage() {
  const [culqiLoaded, setCulqiLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (window.Culqi) {
      window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
      
      window.Culqi.options({
        lang: 'es', // o 'en'
        modal: false, // Usamos custom form
      });
      
      setCulqiLoaded(true);
    }
  }, []);
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    if (!window.Culqi) {
      alert('Error loading payment system');
      setProcessing(false);
      return;
    }
    
    // Culqi validará automáticamente y generará el token
    window.Culqi.createToken();
  };
  
  // Callback cuando Culqi genera el token
  useEffect(() => {
    window.culqi = async function() {
      const token = window.Culqi.token.id;
      
      try {
        // Enviar token al backend
        const response = await fetch('/api/checkout/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            orderId: sessionStorage.getItem('orderId'),
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Redirigir a confirmación
          window.location.href = `/order-confirmation/${data.orderNumber}`;
        } else {
          alert(data.error || 'Payment failed');
          setProcessing(false);
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('An error occurred. Please try again.');
        setProcessing(false);
      }
    };
  }, []);
  
  return (
    <>
      <Script
        src="https://checkout.culqi.com/js/v4"
        onLoad={() => {
          if (window.Culqi) {
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
            setCulqiLoaded(true);
          }
        }}
      />
      
      <form onSubmit={handlePayment}>
        <div>
          <label>Card Number</label>
          <input
            type="text"
            data-culqi="card[number]"
            placeholder="4111 1111 1111 1111"
            maxLength={19}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Expiration</label>
            <input
              type="text"
              data-culqi="card[exp_month]"
              placeholder="MM"
              maxLength={2}
              required
            />
          </div>
          <div>
            <input
              type="text"
              data-culqi="card[exp_year]"
              placeholder="YYYY"
              maxLength={4}
              required
            />
          </div>
        </div>
        
        <div>
          <label>CVV</label>
          <input
            type="text"
            data-culqi="card[cvv]"
            placeholder="123"
            maxLength={4}
            required
          />
        </div>
        
        <div>
          <label>Cardholder Name</label>
          <input
            type="text"
            data-culqi="card[email]"
            placeholder="john@example.com"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={!culqiLoaded || processing}
          className="ms-btn-primary w-full"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </>
  );
}
```

### 3.2 Backend Implementation (Express)

```javascript
// backend/controllers/paymentController.js
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;

exports.processPayment = async (req, res) => {
  const { token, orderId } = req.body;
  
  try {
    // 1. Obtener la orden de la base de datos
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // 2. Verificar que la orden no haya sido pagada
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order already processed' 
      });
    }
    
    // 3. Crear cargo en Culqi
    const culqiResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CULQI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(order.total_amount * 100), // Convertir a centavos
        currency_code: 'PEN',
        email: order.email,
        source_id: token,
        description: `Orden ${order.order_number} - Matteo Salvatore`,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          customer_id: order.customer_id,
        },
        antifraud_details: {
          address: order.shipping_address,
          address_city: order.shipping_city,
          country_code: 'PE',
          first_name: order.shipping_first_name,
          last_name: order.shipping_last_name,
          phone_number: order.shipping_phone,
        },
      }),
    });
    
    const culqiData = await culqiResponse.json();
    
    // 4. Verificar respuesta de Culqi
    if (culqiData.object === 'error') {
      console.error('Culqi error:', culqiData);
      
      return res.status(400).json({
        success: false,
        error: culqiData.user_message || culqiData.merchant_message,
        code: culqiData.type,
      });
    }
    
    // 5. Pago exitoso - Guardar en base de datos
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        culqi_charge_id: culqiData.id,
        payment_method: 'card',
        card_brand: culqiData.source.card_brand,
        card_last_four: culqiData.source.card_number.slice(-4),
        status: 'completed',
        amount: order.total_amount,
        currency: 'PEN',
        culqi_response: culqiData,
        paid_at: new Date(culqiData.creation_date * 1000),
      });
    
    if (paymentError) {
      console.error('Error saving payment:', paymentError);
    }
    
    // 6. Actualizar estado de la orden
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        updated_at: new Date(),
      })
      .eq('id', order.id);
    
    if (updateError) {
      console.error('Error updating order:', updateError);
    }
    
    // 7. Reducir stock de productos
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('variant_id, quantity')
      .eq('order_id', order.id);
    
    for (const item of orderItems) {
      await supabase.rpc('decrement_stock', {
        variant_id: item.variant_id,
        quantity: item.quantity,
      });
    }
    
    // 8. Enviar confirmación por email (async)
    sendOrderConfirmationEmail(order).catch(console.error);
    
    // 9. Enviar confirmación por WhatsApp (async)
    sendWhatsAppConfirmation(order).catch(console.error);
    
    // 10. Responder con éxito
    return res.json({
      success: true,
      orderNumber: order.order_number,
      chargeId: culqiData.id,
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred processing your payment',
    });
  }
};

// Función auxiliar para decrementar stock
// backend/migrations/add_decrement_stock_function.sql
/*
CREATE OR REPLACE FUNCTION decrement_stock(variant_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE product_variants
  SET stock_quantity = stock_quantity - quantity
  WHERE id = variant_id;
END;
$$ LANGUAGE plpgsql;
*/
```

### 3.3 Webhook de Culqi (para eventos asincrónicos)

```javascript
// backend/controllers/webhookController.js
const crypto = require('crypto');

exports.culqiWebhook = async (req, res) => {
  const signature = req.headers['x-culqi-signature'];
  const rawBody = JSON.stringify(req.body);
  
  // 1. Verificar firma del webhook
  const expectedSignature = crypto
    .createHmac('sha256', process.env.CULQI_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = req.body;
  
  try {
    switch (event.type) {
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object);
        break;
        
      case 'charge.failed':
        await handleChargeFailed(event.data.object);
        break;
        
      case 'refund.created':
        await handleRefundCreated(event.data.object);
        break;
        
      default:
        console.log('Unhandled webhook event:', event.type);
    }
    
    return res.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const handleChargeSucceeded = async (charge) => {
  const orderId = charge.metadata.order_id;
  
  await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', orderId);
  
  console.log(`Charge succeeded for order ${orderId}`);
};

const handleChargeFailed = async (charge) => {
  const orderId = charge.metadata.order_id;
  
  await supabase
    .from('orders')
    .update({ status: 'payment_failed' })
    .eq('id', orderId);
  
  console.log(`Charge failed for order ${orderId}`);
};

const handleRefundCreated = async (refund) => {
  const chargeId = refund.charge_id;
  
  const { data: payment } = await supabase
    .from('payments')
    .select('order_id')
    .eq('culqi_charge_id', chargeId)
    .single();
  
  if (payment) {
    await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('culqi_charge_id', chargeId);
    
    await supabase
      .from('orders')
      .update({ status: 'refunded' })
      .eq('id', payment.order_id);
  }
  
  console.log(`Refund created for charge ${chargeId}`);
};

// Ruta del webhook
// backend/routes/webhooks.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/culqi', express.raw({ type: 'application/json' }), webhookController.culqiWebhook);

module.exports = router;
```

---

## 4. Componente de Resumen de Orden

```typescript
// components/checkout/OrderSummary.tsx
'use client';

import { useCart } from '@/hooks/useCart';
import { calculateOrderTotals } from '@/utils/calculations';
import { formatCurrency } from '@/utils/format';

interface OrderSummaryProps {
  shippingCost?: number;
  discountAmount?: number;
  showItems?: boolean;
}

export function OrderSummary({ 
  shippingCost = 0, 
  discountAmount = 0,
  showItems = true 
}: OrderSummaryProps) {
  const { items } = useCart();
  
  const totals = calculateOrderTotals(items, shippingCost, discountAmount);
  
  return (
    <div className="bg-ms-pearl p-6 rounded-lg">
      <h3 className="ms-heading-3 mb-6">Order Summary</h3>
      
      {showItems && (
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img 
                src={item.product.image_url} 
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="ms-body font-medium">{item.product.name}</p>
                <p className="ms-body-small text-ms-slate">
                  {item.variant.color}, Size {item.variant.size}
                </p>
                <p className="ms-body-small">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="ms-body font-medium">
                  {formatCurrency(
                    (item.product.base_price + (item.variant.additional_price || 0)) * item.quantity
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-ms-fog pt-4 space-y-2">
        <div className="flex justify-between ms-body-small">
          <span className="text-ms-stone">Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        
        <div className="flex justify-between ms-body-small">
          <span className="text-ms-stone">Shipping</span>
          <span>
            {totals.shippingCost === 0 ? 'FREE' : formatCurrency(totals.shippingCost)}
          </span>
        </div>
        
        {totals.discountAmount > 0 && (
          <div className="flex justify-between ms-body-small text-ms-success">
            <span>Discount</span>
            <span>-{formatCurrency(totals.discountAmount)}</span>
          </div>
        )}
        
        <div className="flex justify-between ms-body-small">
          <span className="text-ms-stone">
            IGV (18%)
            <span className="ml-1 text-xs">*</span>
          </span>
          <span>{formatCurrency(totals.taxAmount)}</span>
        </div>
      </div>
      
      <div className="border-t border-ms-black mt-4 pt-4">
        <div className="flex justify-between">
          <span className="ms-heading-3">Total</span>
          <span className="ms-heading-3">{formatCurrency(totals.totalAmount)}</span>
        </div>
        <p className="ms-caption mt-2">
          * IGV incluido en el total
        </p>
      </div>
    </div>
  );
}

// utils/format.ts
export const formatCurrency = (amount: number, currency: string = 'PEN'): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
```

---

## 5. Testing del Flujo de Pago

### 5.1 Tarjetas de Prueba (Culqi Test Environment)

```javascript
// Tarjetas de prueba para desarrollo
const TEST_CARDS = {
  visa: {
    number: '4111111111111111',
    cvv: '123',
    exp: '12/2025',
    result: 'Aprobada'
  },
  mastercard: {
    number: '5111111111111118',
    cvv: '123',
    exp: '12/2025',
    result: 'Aprobada'
  },
  amex: {
    number: '371111111111114',
    cvv: '1234',
    exp: '12/2025',
    result: 'Aprobada'
  },
  declined: {
    number: '4000000000000002',
    cvv: '123',
    exp: '12/2025',
    result: 'Rechazada'
  },
  insufficient_funds: {
    number: '4000000000000341',
    cvv: '123',
    exp: '12/2025',
    result: 'Fondos insuficientes'
  }
};
```

### 5.2 Test Suite (Jest)

```javascript
// __tests__/checkout/calculations.test.js
import { calculateOrderTotals } from '@/utils/calculations';

describe('Order Calculations', () => {
  const mockItems = [
    {
      product: { base_price: 100 },
      variant: { additional_price: 0 },
      quantity: 2
    },
    {
      product: { base_price: 200 },
      variant: { additional_price: 20 },
      quantity: 1
    }
  ];
  
  test('calculates subtotal correctly', () => {
    const totals = calculateOrderTotals(mockItems, 0, 0);
    expect(totals.subtotal).toBe(420.00);
  });
  
  test('calculates IGV (18%) correctly', () => {
    const totals = calculateOrderTotals(mockItems, 0, 0);
    expect(totals.taxAmount).toBe(75.60); // 18% de 420
  });
  
  test('calculates total with shipping', () => {
    const totals = calculateOrderTotals(mockItems, 20, 0);
    expect(totals.subtotal).toBe(420.00);
    expect(totals.shippingCost).toBe(20.00);
    expect(totals.taxAmount).toBe(79.20); // 18% de (420 + 20)
    expect(totals.totalAmount).toBe(519.20);
  });
  
  test('applies discount correctly', () => {
    const totals = calculateOrderTotals(mockItems, 0, 50);
    expect(totals.discountAmount).toBe(50.00);
    expect(totals.taxAmount).toBe(66.60); // 18% de (420 - 50)
    expect(totals.totalAmount).toBe(436.60);
  });
});
```

---

## 6. Error Handling

```typescript
// utils/culqi-errors.ts

export const CULQI_ERROR_MESSAGES = {
  'card_declined': {
    es: 'Tu tarjeta fue rechazada. Por favor, intenta con otra tarjeta.',
    en: 'Your card was declined. Please try another card.',
  },
  'insufficient_funds': {
    es: 'Fondos insuficientes. Por favor, verifica tu saldo.',
    en: 'Insufficient funds. Please check your balance.',
  },
  'invalid_card': {
    es: 'Número de tarjeta inválido. Verifica los datos.',
    en: 'Invalid card number. Please check the details.',
  },
  'expired_card': {
    es: 'Tu tarjeta ha expirado. Usa otra tarjeta.',
    en: 'Your card has expired. Please use another card.',
  },
  'processing_error': {
    es: 'Error al procesar el pago. Intenta nuevamente.',
    en: 'Error processing payment. Please try again.',
  },
  'default': {
    es: 'Ocurrió un error. Por favor, intenta nuevamente.',
    en: 'An error occurred. Please try again.',
  },
};

export const getCulqiErrorMessage = (errorCode: string, language: 'es' | 'en' = 'es'): string => {
  return CULQI_ERROR_MESSAGES[errorCode]?.[language] || CULQI_ERROR_MESSAGES.default[language];
};
```

---

## 7. Confirmación de Orden

```typescript
// app/order-confirmation/[orderNumber]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { formatCurrency } from '@/utils/format';
import { CheckCircle } from 'lucide-react';

export default async function OrderConfirmationPage({ 
  params 
}: { 
  params: { orderNumber: string } 
}) {
  const supabase = createClient();
  
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (name_es, name_en),
        variant:product_variants (size, color)
      )
    `)
    .eq('order_number', params.orderNumber)
    .single();
  
  if (!order) {
    return <div>Order not found</div>;
  }
  
  return (
    <div className="ms-container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-ms-success mx-auto mb-4" />
        
        <h1 className="ms-heading-1 mb-2">¡Gracias por tu compra!</h1>
        <p className="ms-body-large text-ms-slate mb-8">
          Tu orden ha sido confirmada
        </p>
        
        <div className="bg-ms-pearl p-6 rounded-lg mb-8">
          <p className="ms-label mb-2">Número de Orden</p>
          <p className="ms-heading-2">{order.order_number}</p>
        </div>
        
        <div className="text-left space-y-4 mb-8">
          <div>
            <p className="ms-label">Envío a:</p>
            <p className="ms-body">
              {order.shipping_first_name} {order.shipping_last_name}
            </p>
            <p className="ms-body text-ms-slate">{order.shipping_address}</p>
            <p className="ms-body text-ms-slate">
              {order.shipping_district}, {order.shipping_city}
            </p>
          </div>
          
          <div>
            <p className="ms-label">Fecha estimada de entrega:</p>
            <p className="ms-body">
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div>
            <p className="ms-label">Total pagado:</p>
            <p className="ms-heading-3">{formatCurrency(order.total_amount)}</p>
            <p className="ms-caption">Incluye IGV S/ {formatCurrency(order.tax_amount)}</p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <a href={`/account/orders/${order.order_number}`} className="ms-btn-primary">
            Ver detalles del pedido
          </a>
          <a href="/products" className="ms-btn-secondary">
            Seguir comprando
          </a>
        </div>
        
        <p className="ms-body-small text-ms-slate mt-8">
          Te hemos enviado un email de confirmación a <strong>{order.email}</strong>
        </p>
      </div>
    </div>
  );
}
```

---

**Siguiente paso:** ¿Continuamos con la estrategia SEO/GEO completa o con el código de los componentes del frontend?
