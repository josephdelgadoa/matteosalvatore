-- Ensure description columns can hold large text
ALTER TABLE products 
ALTER COLUMN description_es TYPE TEXT,
ALTER COLUMN description_en TYPE TEXT;
