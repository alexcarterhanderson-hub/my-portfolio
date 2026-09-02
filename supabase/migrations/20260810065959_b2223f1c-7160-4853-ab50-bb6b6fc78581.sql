CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'NEW PROJECT',
  subtitle TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  video_id TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  tech TEXT[] NOT NULL DEFAULT '{}',
  color TEXT NOT NULL DEFAULT 'cyan',
  status TEXT NOT NULL DEFAULT 'live',
  layout TEXT NOT NULL DEFAULT 'standard',
  hover_effect TEXT NOT NULL DEFAULT 'tilt',
  glow INTEGER NOT NULL DEFAULT 50,
  featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  cta_label TEXT DEFAULT '',
  cta_url TEXT DEFAULT '',
  likes INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.timeline_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL DEFAULT '',
  codename TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  content TEXT NOT NULL DEFAULT '',
  approved BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline_entries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.timeline_entries TO service_role;
GRANT ALL ON public.reviews TO service_role;
GRANT ALL ON public.site_settings TO service_role;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public manage projects" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public manage timeline" ON public.timeline_entries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public manage reviews" ON public.reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public manage settings" ON public.site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public manage activity" ON public.activity_log FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timeline_updated_at BEFORE UPDATE ON public.timeline_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();