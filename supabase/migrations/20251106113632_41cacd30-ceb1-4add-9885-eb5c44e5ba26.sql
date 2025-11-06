-- Add 'vendeur' role to app_role if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'vendeur'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'vendeur';
  END IF;
END $$;

-- Create public bucket for book covers if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for book-covers bucket
DO $$
BEGIN
  -- Public can view book covers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can view book covers'
  ) THEN
    CREATE POLICY "Public can view book covers"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'book-covers');
  END IF;

  -- Users can upload their own book covers (in a folder named with their uid)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload book covers'
  ) THEN
    CREATE POLICY "Users can upload book covers"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'book-covers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Users can update their own uploaded files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update book covers'
  ) THEN
    CREATE POLICY "Users can update book covers"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'book-covers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;