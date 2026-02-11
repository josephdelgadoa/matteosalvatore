-- Enable RLS on tables
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- 1. Cart Policies
-- Allow users to view their own cart items
CREATE POLICY "Users can view their own cart" ON cart
  FOR SELECT USING (auth.uid() = customer_id);

-- Allow users to insert into their own cart
CREATE POLICY "Users can create their own cart items" ON cart
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Allow users to update their own cart items
CREATE POLICY "Users can update their own cart items" ON cart
  FOR UPDATE USING (auth.uid() = customer_id);

-- Allow users to delete their own cart items
CREATE POLICY "Users can delete their own cart items" ON cart
  FOR DELETE USING (auth.uid() = customer_id);


-- 2. Reviews Policies
-- Allow everyone to view reviews
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Allow authenticated users to insert reviews (linked to their ID)
CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);


-- 3. Chatbot Conversations Policies
-- Allow users to view their own conversations
CREATE POLICY "Users can view their own conversations" ON chatbot_conversations
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own conversations
CREATE POLICY "Users can start their own conversations" ON chatbot_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own conversations (e.g., adding messages)
CREATE POLICY "Users can update their own conversations" ON chatbot_conversations
  FOR UPDATE USING (auth.uid() = user_id);


-- 4. SEO Metadata Policies
-- Allow everyone to read SEO metadata
CREATE POLICY "SEO metadata is public" ON seo_metadata
  FOR SELECT USING (true);

-- Only allow service role (admin) to modify SEO metadata
-- Note: Service role bypasses RLS, so no explicit policy needed for it, 
-- but we ensure NO other policy allows write access for anon/authenticated.
