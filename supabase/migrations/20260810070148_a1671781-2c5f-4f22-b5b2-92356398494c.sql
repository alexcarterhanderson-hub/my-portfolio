ALTER TABLE public.timeline_entries ADD COLUMN color TEXT NOT NULL DEFAULT 'cyan';
ALTER TABLE public.timeline_entries ADD COLUMN progress INTEGER NOT NULL DEFAULT 100;
UPDATE public.timeline_entries SET color = title, title = '' WHERE title IN ('cyan','magenta','purple','green');