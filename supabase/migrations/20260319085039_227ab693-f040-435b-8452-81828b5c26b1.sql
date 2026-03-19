
DROP POLICY IF EXISTS "Authenticated users can upload affiliate images" ON storage.objects;

CREATE POLICY "Only admins can upload affiliate images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'affiliate-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);
