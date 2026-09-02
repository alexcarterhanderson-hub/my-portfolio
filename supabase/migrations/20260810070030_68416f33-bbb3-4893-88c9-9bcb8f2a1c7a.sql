CREATE POLICY "public read media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "public write media" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "public update media" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
CREATE POLICY "public delete media" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'media');