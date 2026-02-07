-- 003_add_triggers.sql

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate IGV (Tax) automatically
CREATE OR REPLACE FUNCTION calculate_order_tax()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tax_amount = ROUND(NEW.subtotal * 0.18, 2);
  NEW.total_amount = NEW.subtotal + NEW.tax_amount + NEW.shipping_cost - COALESCE(NEW.discount_amount, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply tax calculation trigger
CREATE TRIGGER calculate_tax_on_order BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION calculate_order_tax();

-- Function to generate human-readable order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_part VARCHAR(8);
  sequence_number INTEGER;
BEGIN
  -- If order number is already set, do nothing (allows manual overrides if needed)
  IF NEW.order_number IS NOT NULL THEN
    RETURN NEW;
  END IF;

  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Get the current count of orders for today to determine the next sequence number
  -- Note: In high currency scenarios, this might need a sequence or better locking strategy.
  -- For this scale, a count or max query is usually sufficient if handled in transaction.
  SELECT COUNT(*) + 1 INTO sequence_number
  FROM orders
  WHERE order_number LIKE 'MS-' || date_part || '-%';
  
  NEW.order_number := 'MS-' || date_part || '-' || LPAD(sequence_number::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply order number generation trigger
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
