import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const LANG_COLUMN = { en: 0, es: 1, de: 2 } as const;
type Lang = keyof typeof LANG_COLUMN;

function parseDataUrl(dataUrl: string): { buffer: Buffer; contentType: string; ext: string } | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const contentType = match[1];
  const ext = contentType.split('/')[1]?.split('+')[0] || 'bin';
  return { buffer: Buffer.from(match[2], 'base64'), contentType, ext };
}

async function uploadToBucket(courseId: string, lessonIndex: number, kind: 'image' | 'audio', dataUrl: string) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  const path = `${courseId}/${lessonIndex}-${kind}-${Date.now()}.${parsed.ext}`;
  const { error } = await supabaseAdmin().storage.from('session-media').upload(path, parsed.buffer, { contentType: parsed.contentType, upsert: true });
  if (error) throw error;
  const { data } = supabaseAdmin().storage.from('session-media').getPublicUrl(path);
  return data.publicUrl;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  const { courseId, lessonIndex, lang, title, videoUrl, description, image, audio } = body as {
    courseId?: string; lessonIndex?: number; lang?: Lang; title?: string; videoUrl?: string; description?: string;
    image?: { dataUrl?: string; remove?: boolean }; audio?: { dataUrl?: string; name?: string; remove?: boolean };
  };
  if (!courseId || typeof lessonIndex !== 'number' || !lang || !(lang in LANG_COLUMN)) {
    return NextResponse.json({ ok: false, error: 'courseId, lessonIndex, and lang are required.' }, { status: 400 });
  }
  try {
    const patch: Record<string, unknown> = { course_id: courseId, lesson_index: lessonIndex, updated_at: new Date().toISOString() };
    if (typeof title === 'string') patch[`title_${lang}`] = title;
    if (typeof videoUrl === 'string') patch.video_url = videoUrl;
    if (typeof description === 'string') patch[`description_${lang}`] = description;
    if (image?.remove) patch.image_url = null;
    else if (image?.dataUrl) patch.image_url = await uploadToBucket(courseId, lessonIndex, 'image', image.dataUrl);
    if (audio?.remove) { patch.audio_url = null; patch.audio_name = null; }
    else if (audio?.dataUrl) { patch.audio_url = await uploadToBucket(courseId, lessonIndex, 'audio', audio.dataUrl); patch.audio_name = audio.name ?? null; }
    const { error } = await supabaseAdmin().from('session_media').upsert(patch, { onConflict: 'course_id,lesson_index' });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
