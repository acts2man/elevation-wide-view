import { LessonPage } from '@/components/elevation/member';
export default async function Page({params}:{params:Promise<{course:string}>}){const {course}=await params;return <LessonPage key={course} courseId={course}/>}
