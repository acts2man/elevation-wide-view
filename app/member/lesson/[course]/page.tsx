import { LessonPage } from '@/components/elevation/member';
// Prerender the studies known at build time; new studies an admin adds later still work (Next
// renders them on demand) but won't get the same fast, cached path until the next deploy.
export function generateStaticParams() {
  return [{ course: 'revelation' }];
}
export default async function Page({params}:{params:Promise<{course:string}>}){const {course}=await params;return <LessonPage key={course} courseId={course}/>}
