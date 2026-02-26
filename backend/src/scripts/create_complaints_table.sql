-- SQL script to create the complaints table for "Libro de Reclamaciones"
-- Please run this directly in your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.ms_complaints (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_number text NOT NULL UNIQUE, -- Example: 000000001-2026
    
    -- 1. Datos del consumidor reclamante
    consumer_name text NOT NULL,
    consumer_id_type text NOT NULL, -- DNI or CE
    consumer_id_number text NOT NULL,
    consumer_address text NOT NULL,
    consumer_phone text NOT NULL,
    consumer_email text NOT NULL,
    
    -- 2. Identificación del bien contratado
    product_type text NOT NULL, -- Bien or Servicio
    product_description text NOT NULL,
    
    -- 3. Detalle de la reclamación o queja
    complaint_type text NOT NULL, -- Queja or Reclamo
    complaint_details text NOT NULL,
    
    -- 4. Propuesta de solución
    proposed_solution text,
    
    -- Status
    status text DEFAULT 'pending', -- pending, reviewed, resolved
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.ms_complaints ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a complaint (since it's a public form)
CREATE POLICY "Enable insert for everyone"
    ON public.ms_complaints
    FOR INSERT
    WITH CHECK (true);

-- Allow only authenticated admins to select (view) complaints. 
-- Assuming service role can always bypass RLS. 
-- In case there's an admin role, add a policy. Otherwise, default is closed to public.
CREATE POLICY "Enable read for authenticated users only"
    ON public.ms_complaints
    FOR SELECT
    TO authenticated
    USING (true);
