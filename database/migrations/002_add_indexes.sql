-- 002_add_indexes.sql

-- Products
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Variants
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku_variant);

-- Images
CREATE INDEX idx_images_product ON product_images(product_id);

-- Customers
CREATE INDEX idx_customers_email ON customers(email);

-- Addresses
CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- Orders
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Order Items
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Payments
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_culqi ON payments(culqi_charge_id);

-- Cart
CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_cart_customer ON cart(customer_id);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;

-- Chatbot
CREATE INDEX idx_chatbot_session ON chatbot_conversations(session_id);

-- SEO
CREATE UNIQUE INDEX idx_seo_page_slug ON seo_metadata(page_type, slug);
