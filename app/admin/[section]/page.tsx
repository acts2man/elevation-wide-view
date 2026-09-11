import { AdminSection } from '@/components/elevation/admin';
// All real data comes from the browser via Supabase (see ElevationProvider), so this shell has
// nothing request-specific to render — prerendering it removes a serverless invocation (and its
// cold-start latency) from every sidebar click instead of rendering it fresh on each request.
export function generateStaticParams() {
  return [{ section: 'studies' }, { section: 'sessions' }, { section: 'members' }, { section: 'languages' }, { section: 'settings' }];
}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <AdminSection section={section}/>}
