import { AdminSection } from '@/components/elevation/admin';
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <AdminSection section={section}/>}
