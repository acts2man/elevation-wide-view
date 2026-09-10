'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Maximize2 } from 'lucide-react';
import { useElevation } from './provider';

export type VideoSource = { kind: 'file'; src: string } | { kind: 'youtube'; id: string } | { kind: 'vimeo'; id: string; hash?: string } | { kind: 'gumlet'; id: string };

/** Turn a pasted session link into something the inline player can render. */
export function parseVideo(url: string | undefined): VideoSource | null {
  const value = (url ?? '').trim();
  if (!value) return null;
  if (value.startsWith('/')) return { kind: 'file', src: value };
  let parsed: URL;
  try { parsed = new URL(value); } catch { return null; }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  const host = parsed.hostname.replace(/^(www|m)\./, '');
  if (host === 'youtu.be') { const id = parsed.pathname.split('/')[1]; return id ? { kind: 'youtube', id } : null; }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)?.[1];
    return id ? { kind: 'youtube', id } : null;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const match = parsed.pathname.match(/\/(\d+)(?:\/([a-z0-9]+))?/i);
    if (!match) return null;
    const hash = parsed.searchParams.get('h') || match[2];
    return hash ? { kind: 'vimeo', id: match[1], hash } : { kind: 'vimeo', id: match[1] };
  }
  // Gumlet: a gumlet.tv/watch/<id> share link or a play.gumlet.io/embed/<id> player link.
  if (host === 'gumlet.tv' || host === 'gumlet.io' || host === 'play.gumlet.io') {
    const id = parsed.pathname.match(/\/(?:watch|embed)\/([a-f0-9]{8,})/i)?.[1];
    return id ? { kind: 'gumlet', id } : null;
  }
  return { kind: 'file', src: value };
}

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const whole = Math.floor(seconds);
  const h = Math.floor(whole / 3600), m = Math.floor((whole % 3600) / 60), s = whole % 60;
  return `${h ? `${h}:` : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(s).padStart(2, '0')}`;
};

/** Plays a session video inside the lesson player. Calls onEnded when the video finishes so the lesson can advance. */
export function LessonVideo({ source, title, onEnded }: { source: VideoSource; title: string; onEnded: () => void }) {
  return source.kind === 'file' ? <FileVideo src={source.src} title={title} onEnded={onEnded} /> : <EmbeddedVideo source={source} title={title} onEnded={onEnded} />;
}

function FileVideo({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const { tr } = useElevation();
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(NaN);
  const [failed, setFailed] = useState(false);
  const toggle = () => { const v = video.current; if (!v) return; if (v.paused) void v.play().catch(() => setPaused(true)); else v.pause(); };
  const seekTo = (fraction: number) => { const v = video.current; if (!v || !Number.isFinite(v.duration)) return; v.currentTime = Math.min(Math.max(fraction, 0), 1) * v.duration; };
  const seekFromPointer = (e: React.PointerEvent<HTMLDivElement>) => { const rect = e.currentTarget.getBoundingClientRect(); seekTo((e.clientX - rect.left) / rect.width); };
  const seekWithKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const v = video.current; if (!v || !Number.isFinite(v.duration)) return;
    const step = e.key === 'ArrowRight' ? 5 : e.key === 'ArrowLeft' ? -5 : 0;
    if (step) { e.preventDefault(); v.currentTime = Math.min(Math.max(v.currentTime + step, 0), v.duration); }
  };
  const fullscreen = () => { const el = frame.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.(); };
  const progress = Number.isFinite(duration) && duration > 0 ? (time / duration) * 100 : 0;
  return <div className="player-video" ref={frame}>
    <video ref={video} src={src} title={title} autoPlay playsInline preload="metadata" onClick={toggle}
      onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
      onDurationChange={e => setDuration(e.currentTarget.duration)} onEnded={onEnded} onError={() => setFailed(true)} />
    {failed && <div className="player-video-error">{tr('This video could not be loaded. Check the session link in the admin studio.', 'No se pudo cargar este video. Revisa el enlace de la sesión en el estudio de administración.', 'Dieses Video konnte nicht geladen werden. Prüfe den Link der Einheit im Admin-Studio.')}</div>}
    <div className="player-controls live">
      <button type="button" onClick={toggle} aria-label={paused ? tr('Play', 'Reproducir', 'Abspielen') : tr('Pause', 'Pausar', 'Pausieren')}>{paused ? <Play /> : <Pause />}</button>
      <div className="player-progress" role="slider" tabIndex={0} aria-label={tr('Seek', 'Buscar', 'Spulen')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} onPointerDown={seekFromPointer} onKeyDown={seekWithKeys}><span style={{ width: `${progress}%` }} /></div>
      <span>{clock(time)} / {clock(duration)}</span>
      <button type="button" onClick={fullscreen} aria-label={tr('Full screen', 'Pantalla completa', 'Vollbild')}><Maximize2 /></button>
    </div>
  </div>;
}

const YOUTUBE_ORIGIN = 'https://www.youtube.com';
const VIMEO_ORIGIN = 'https://player.vimeo.com';
const GUMLET_ORIGIN = 'https://play.gumlet.io';

function embedUrl(source: Exclude<VideoSource, { kind: 'file' }>) {
  if (source.kind === 'youtube') {
    const params = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1', enablejsapi: '1' });
    if (typeof window !== 'undefined') params.set('origin', window.location.origin);
    return `${YOUTUBE_ORIGIN}/embed/${encodeURIComponent(source.id)}?${params}`;
  }
  if (source.kind === 'gumlet') {
    return `${GUMLET_ORIGIN}/embed/${encodeURIComponent(source.id)}?autoplay=true&preload=true`;
  }
  const params = new URLSearchParams({ autoplay: '1', api: '1' });
  if (source.hash) params.set('h', source.hash);
  return `${VIMEO_ORIGIN}/video/${encodeURIComponent(source.id)}?${params}`;
}

/** YouTube and Vimeo players report "ended" through postMessage, which lets the lesson advance to the next video. */
function EmbeddedVideo({ source, title, onEnded }: { source: Exclude<VideoSource, { kind: 'file' }>; title: string; onEnded: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const ended = useRef(onEnded);
  useEffect(() => { ended.current = onEnded; }, [onEnded]);
  const [src] = useState(() => embedUrl(source));
  useEffect(() => {
    // Only the YouTube and Vimeo players report playback events we can listen for.
    if (source.kind !== 'youtube' && source.kind !== 'vimeo') return;
    const target = source.kind === 'youtube' ? YOUTUBE_ORIGIN : VIMEO_ORIGIN;
    const post = (message: object) => frame.current?.contentWindow?.postMessage(JSON.stringify(message), target);
    const subscribe = () => {
      if (source.kind === 'youtube') { post({ event: 'listening', id: 'lesson-video', channel: 'widget' }); post({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: 'lesson-video', channel: 'widget' }); }
      else post({ method: 'addEventListener', value: 'ended' });
    };
    let fired = false;
    // The embed only starts reporting once it hears from us, so keep asking until its first reply arrives.
    const retry = window.setInterval(subscribe, 500);
    const stop = window.setTimeout(() => window.clearInterval(retry), 20000);
    const handle = (e: MessageEvent) => {
      if (e.origin !== target || e.source !== frame.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
      if (!data || typeof data !== 'object') return;
      window.clearInterval(retry);
      const finished = source.kind === 'youtube'
        ? (data.event === 'onStateChange' && data.info === 0) || (data.event === 'infoDelivery' && (data.info as { playerState?: number } | undefined)?.playerState === 0)
        : data.event === 'ended';
      if (finished && !fired) { fired = true; ended.current(); }
    };
    window.addEventListener('message', handle);
    return () => { window.removeEventListener('message', handle); window.clearInterval(retry); window.clearTimeout(stop); };
  }, [source.kind, source.id]);
  return <div className="player-video"><iframe ref={frame} src={src} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen /></div>;
}
