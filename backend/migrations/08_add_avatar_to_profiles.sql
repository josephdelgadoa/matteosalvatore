-- Add avatar_url to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ensure RLS allows updates to avatar_url (already covered by "Users can update own profile")
-- But we might need to verify if admins can update OTHER users' profiles.

-- Policy: Admins can update ANY profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can update any profile'
    ) THEN
        CREATE POLICY "Admins can update any profile" ON public.profiles
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND (profiles.role = 'admin' OR profiles.role = 'super_admin')
                )
            );
    END IF;
END
$$;

-- Policy: Admins can delete ANY profile (if we implement delete)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can delete any profile'
    ) THEN
        CREATE POLICY "Admins can delete any profile" ON public.profiles
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND (profiles.role = 'admin' OR profiles.role = 'super_admin')
                )
            );
    END IF;
END
$$;
