import { supabase } from '@/integrations/supabase/client';

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadMedia(file: File, folder = 'cards'): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from('media').createSignedUrl(path, TEN_YEARS);
  if (signErr) throw signErr;
  return data.signedUrl;
}

export function youtubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : trimmed;
}
