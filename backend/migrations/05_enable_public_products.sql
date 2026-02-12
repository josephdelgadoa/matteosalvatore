-- Allow everyone to read products and variants
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);

-- Allow admins (service role) to do everything. 
-- Service role bypasses RLS, so this might not be needed if using explicit service key,
-- but good to have for authenticated admin users if we implement that.
