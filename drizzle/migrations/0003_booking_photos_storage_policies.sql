CREATE POLICY "Authenticated can upload booking photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'booking-photos');

CREATE POLICY "Authenticated can view booking photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'booking-photos');

CREATE POLICY "Authenticated can update own booking photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'booking-photos' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'booking-photos' AND owner = auth.uid());
