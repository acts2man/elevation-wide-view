'use client';
import { supabaseBrowser } from './client';

/**
 * Uploads a blob to Supabase Storage with real byte-level progress via XHR — the supabase-js
 * `storage.upload()` call uses fetch under the hood and has no progress event, which is why a
 * multi-minute audio upload used to look completely frozen.
 */
export function uploadWithProgress(bucket: string, path: string, blob: Blob, onProgress?: (fraction: number) => void): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { reject(new Error('Not signed in.')); return; }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.setRequestHeader('Content-Type', blob.type || 'application/octet-stream');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total); };
    xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`)); };
    xhr.onerror = () => reject(new Error('Upload failed: network error.'));
    xhr.send(blob);
  });
}
