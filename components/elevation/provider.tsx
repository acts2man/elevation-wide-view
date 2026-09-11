'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { Toaster } from '@/components/ui/sonner';
import { supabaseBrowser } from '@/lib/supabase/client';
import { uploadWithProgress } from '@/lib/supabase/upload';
import { initialCourses, pick, type Course, type Language, type Localized } from './data';

type Note = { id: string; course: string; lesson: number; text: string };
type Role = 'admin' | 'member' | null;
type SessionMediaPatch = { title?: string; videoUrl?: string; description?: string; image?: string; audioUrl?: string; audioName?: string };
type StudyInput = { id?:string; title:string; description:string; category:Course['category']; status:Course['status'] };
type State = {
 lang:Language; setLang:(v:Language)=>void; tr:(en:string,es:string,de:string)=>string; tx:(t:Localized)=>string;
 courses:Course[]; setCourses:React.Dispatch<React.SetStateAction<Course[]>>;
 saveSession:(courseId:string,index:number,patch:SessionMediaPatch,onProgress?:(label:string,fraction:number)=>void)=>Promise<void>; savingSession:boolean;
 addSession:(courseId:string)=>Promise<void>; saveStudy:(input:StudyInput)=>Promise<void>;
 user:User|null; role:Role; signOut:()=>Promise<void>;
 completed:string[]; complete:(key:string)=>void; notes:Note[]; saveNote:(note:Note)=>void;
};
const Context=createContext<State|null>(null);
const PLACEHOLDER_TITLE:Localized=['New session','Nueva sesión','Neue Einheit'];

type CourseRow = { id:string; title_en:string; title_es?:string|null; title_de?:string|null; subtitle_en?:string|null; subtitle_es?:string|null; subtitle_de?:string|null; description_en?:string|null; description_es?:string|null; description_de?:string|null; theme:string; category:string; status:string; lesson_count:number };

/** Course structure (title/description/lesson count) lives in Supabase so admins can add sessions and studies without a code deploy. */
function applyCourseRows(courses:Course[],rows:CourseRow[]):Course[]{
 const byId=new Map(rows.map(r=>[r.id,r]));
 const merged=courses.map(c=>{
  const r=byId.get(c.id);
  if(!r)return c;
  byId.delete(c.id);
  return buildCourseFromRow(r,c);
 });
 for(const r of byId.values())merged.push(buildCourseFromRow(r));
 return merged;
}
function buildCourseFromRow(r:CourseRow,existing?:Course):Course{
 const title:Localized=[r.title_en,r.title_es||r.title_en,r.title_de||r.title_en];
 const subtitle:Localized=[r.subtitle_en||'',r.subtitle_es||r.subtitle_en||'',r.subtitle_de||r.subtitle_en||''];
 const description:Localized=[r.description_en||'',r.description_es||r.description_en||'',r.description_de||r.description_en||''];
 const lessons:Localized[]=Array.from({length:r.lesson_count},(_,i)=>existing?.lessons[i]??[...PLACEHOLDER_TITLE] as Localized);
 return {id:r.id,title,subtitle,description,count:r.lesson_count,theme:r.theme,category:r.category as Course['category'],status:r.status as Course['status'],lessons,videos:existing?.videos,images:existing?.images,audio:existing?.audio,audioNames:existing?.audioNames,descriptions:existing?.descriptions};
}

type SessionRow = { course_id:string; lesson_index:number; title_en?:string|null; title_es?:string|null; title_de?:string|null; video_url?:string|null; image_url?:string|null; description_en?:string|null; description_es?:string|null; description_de?:string|null; audio_url?:string|null; audio_name?:string|null };

/** Session titles, video links, graphics, descriptions, and audio all live in Supabase, so every open screen (any tab, any device) sees the same data. */
function applySessionRows(courses:Course[],rows:SessionRow[]):Course[]{
 const byCourse=new Map<string,Map<number,SessionRow>>();
 for(const r of rows){
  if(!byCourse.has(r.course_id))byCourse.set(r.course_id,new Map());
  byCourse.get(r.course_id)!.set(r.lesson_index,r);
 }
 return courses.map(c=>{
  const rows=byCourse.get(c.id);
  if(!rows)return c;
  const lessons=c.lessons.map((l,i)=>{
   const r=rows.get(i);if(!r)return l;
   const a=[...l] as Localized;
   if(r.title_en)a[0]=r.title_en;if(r.title_es)a[1]=r.title_es;if(r.title_de)a[2]=r.title_de;
   return a;
  });
  const videos=c.lessons.map((_,i)=>rows.get(i)?.video_url??'');
  const images=c.lessons.map((_,i)=>rows.get(i)?.image_url??'');
  const audio=c.lessons.map((_,i)=>rows.get(i)?.audio_url??'');
  const audioNames=c.lessons.map((_,i)=>rows.get(i)?.audio_name??'');
  const descriptions=c.lessons.map((_,i)=>{
   const r=rows.get(i);
   return [r?.description_en??'',r?.description_es??'',r?.description_de??''] as Localized;
  });
  return {...c,lessons,videos,images,audio,audioNames,descriptions};
 });
}

function dataUrlToBlob(dataUrl:string):{blob:Blob;ext:string}{
 const match=/^data:([^;]+);base64,(.+)$/.exec(dataUrl)!;
 const contentType=match[1];
 const ext=contentType.split('/')[1]?.split('+')[0]||'bin';
 const bytes=atob(match[2]);
 const buffer=new Uint8Array(bytes.length);
 for(let i=0;i<bytes.length;i++)buffer[i]=bytes.charCodeAt(i);
 return {blob:new Blob([buffer],{type:contentType}),ext};
}

export function ElevationProvider({children}:{children:ReactNode}) {
 const supabase=supabaseBrowser();
 const [lang,setLanguage]=useState<Language>('en');
 const [courses,setCourses]=useState(initialCourses);
 const [user,setUser]=useState<User|null>(null);
 const [role,setRole]=useState<Role>(null);
 const [completed,setCompleted]=useState<string[]>([]);
 const [notes,setNotes]=useState<Note[]>([]);
 const [savingSession,setSavingSession]=useState(false);

 useEffect(()=>{const saved=localStorage.getItem('elevation-language');if(saved==='en'||saved==='es'||saved==='de')setLanguage(saved)},[]);

 const loadAll=async()=>{
  const [{data:courseRows,error:courseErr},{data:mediaRows,error:mediaErr}]=await Promise.all([
   supabase.from('courses').select('*'),
   supabase.from('session_media').select('*'),
  ]);
  setCourses(cs=>{
   let next=cs;
   if(!courseErr&&courseRows)next=applyCourseRows(next,courseRows as CourseRow[]);
   if(!mediaErr&&mediaRows)next=applySessionRows(next,mediaRows as SessionRow[]);
   return next;
  });
 };
 useEffect(()=>{
  loadAll();
  const interval=window.setInterval(loadAll,20000);
  window.addEventListener('focus',loadAll);
  return ()=>{window.clearInterval(interval);window.removeEventListener('focus',loadAll)};
 },[]);

 const loadOwnData=async(uid:string)=>{
  const [{data:progress},{data:noteRows}]=await Promise.all([
   supabase.from('member_progress').select('course_id,lesson_index').eq('member_id',uid),
   supabase.from('member_notes').select('course_id,lesson_index,text').eq('member_id',uid),
  ]);
  if(progress)setCompleted(progress.map(p=>`${p.course_id}-${p.lesson_index}`));
  if(noteRows)setNotes(noteRows.map(n=>({id:`${n.course_id}-${n.lesson_index}`,course:n.course_id,lesson:n.lesson_index,text:n.text})));
 };
 useEffect(()=>{
  supabase.auth.getSession().then(({data})=>{
   const u=data.session?.user??null;setUser(u);
   if(u){
    supabase.from('profiles').select('role').eq('id',u.id).single().then(({data:p})=>{const r=(p?.role as Role)??'member';setRole(r);document.cookie=`elevation_role=${r}; path=/; max-age=2592000; samesite=lax`});
    loadOwnData(u.id);
   }
  });
  const {data:sub}=supabase.auth.onAuthStateChange((_event,session)=>{
   const u=session?.user??null;setUser(u);
   if(u){
    supabase.from('profiles').select('role').eq('id',u.id).single().then(({data:p})=>{const r=(p?.role as Role)??'member';setRole(r);document.cookie=`elevation_role=${r}; path=/; max-age=2592000; samesite=lax`});
    loadOwnData(u.id);
   }else{setRole(null);setCompleted([]);setNotes([]);document.cookie='elevation_role=; path=/; max-age=0'}
  });
  return ()=>sub.subscription.unsubscribe();
 },[]);

 useEffect(()=>{document.documentElement.lang=lang},[lang]);
 const setLang=(v:Language)=>{setLanguage(v);localStorage.setItem('elevation-language',v)};
 const tr=(en:string,es:string,de:string)=>pick([en,es,de],lang);

 const complete=(key:string)=>{
  const wasComplete=completed.includes(key);
  setCompleted(old=>wasComplete?old.filter(k=>k!==key):[...old,key]);
  if(!user)return;
  const [courseId,lessonIndexStr]=key.split(/-(\d+)$/);
  const lessonIndex=Number(lessonIndexStr);
  if(wasComplete)supabase.from('member_progress').delete().match({member_id:user.id,course_id:courseId,lesson_index:lessonIndex});
  else supabase.from('member_progress').insert({member_id:user.id,course_id:courseId,lesson_index:lessonIndex});
 };
 const saveNote=(note:Note)=>{
  setNotes(old=>[...old.filter(n=>n.id!==note.id),note]);
  if(!user)return;
  supabase.from('member_notes').upsert({member_id:user.id,course_id:note.course,lesson_index:note.lesson,text:note.text,updated_at:new Date().toISOString()});
 };
 const signOut=async()=>{await supabase.auth.signOut()};

 const addSession=async(courseId:string)=>{
  const course=courses.find(c=>c.id===courseId);
  if(!course)return;
  const nextCount=course.lessons.length+1;
  setCourses(old=>old.map(c=>c.id!==courseId?c:{...c,count:nextCount,lessons:[...c.lessons,[...PLACEHOLDER_TITLE] as Localized]}));
  await supabase.from('courses').update({lesson_count:nextCount,updated_at:new Date().toISOString()}).eq('id',courseId);
  await loadAll();
 };

 const saveStudy=async(input:StudyInput)=>{
  const id=input.id??`study-${Date.now()}`;
  const existing=courses.find(c=>c.id===id);
  const langIndex=lang==='en'?0:lang==='es'?1:2;
  const row:Record<string,unknown>={
   id,
   [`title_${lang}`]:input.title,
   [`subtitle_${lang}`]:existing?pick(existing.subtitle,lang):input.description,
   [`description_${lang}`]:input.description,
   theme:existing?.theme??'foundation',
   category:input.category,
   status:input.status,
   lesson_count:existing?.lessons.length??0,
   updated_at:new Date().toISOString(),
  };
  if(!existing)row.title_en=row.title_en??input.title;
  setCourses(old=>{
   if(existing)return old.map(c=>{
    if(c.id!==id)return c;
    const title=[...c.title] as Localized;title[langIndex]=input.title;
    const description=[...c.description] as Localized;description[langIndex]=input.description;
    return {...c,title,description,category:input.category,status:input.status};
   });
   return [...old,{id,title:[input.title,input.title,input.title],subtitle:[input.description,input.description,input.description],description:[input.description,input.description,input.description],count:0,theme:'foundation',category:input.category,status:input.status,lessons:[]}];
  });
  await supabase.from('courses').upsert(row,{onConflict:'id'});
  await loadAll();
 };

 const saveSession=async(courseId:string,index:number,patch:SessionMediaPatch,onProgress?:(label:string,fraction:number)=>void)=>{
  setCourses(old=>old.map(c=>{
   if(c.id!==courseId)return c;
   const lessons=c.lessons.map((l,i)=>{
    if(i!==index||patch.title===undefined)return l;
    const a=[...l] as Localized;a[lang==='en'?0:lang==='es'?1:2]=patch.title;return a;
   });
   const videos=patch.videoUrl===undefined?c.videos:c.lessons.map((_,i)=>i===index?patch.videoUrl!.trim():(c.videos?.[i]??''));
   const images=patch.image===undefined?c.images:c.lessons.map((_,i)=>i===index?patch.image!.trim():(c.images?.[i]??''));
   const audio=patch.audioUrl===undefined?c.audio:c.lessons.map((_,i)=>i===index?patch.audioUrl!.trim():(c.audio?.[i]??''));
   const audioNames=patch.audioName===undefined?c.audioNames:c.lessons.map((_,i)=>i===index?patch.audioName!.trim():(c.audioNames?.[i]??''));
   const descriptions=c.lessons.map((_,i)=>(c.descriptions?.[i]??['','',''])as Localized);
   if(patch.description!==undefined){const d=[...descriptions[index]]as Localized;d[lang==='en'?0:lang==='es'?1:2]=patch.description;descriptions[index]=d;}
   return {...c,lessons,videos,images,audio,audioNames,descriptions};
  }));
  setSavingSession(true);
  try{
   const row:Record<string,unknown>={course_id:courseId,lesson_index:index,updated_at:new Date().toISOString()};
   if(patch.title!==undefined)row[`title_${lang}`]=patch.title;
   if(patch.videoUrl!==undefined)row.video_url=patch.videoUrl.trim();
   if(patch.description!==undefined)row[`description_${lang}`]=patch.description;
   if(patch.image!==undefined){
    if(patch.image.startsWith('data:')){
     const {blob,ext}=dataUrlToBlob(patch.image);
     const path=`${courseId}/${index}-image-${Date.now()}.${ext}`;
     await uploadWithProgress('session-media',path,blob,f=>onProgress?.('image',f));
     row.image_url=supabase.storage.from('session-media').getPublicUrl(path).data.publicUrl;
    }else if(patch.image===''){row.image_url=null}
   }
   if(patch.audioUrl!==undefined){
    if(patch.audioUrl.startsWith('data:')){
     const {blob,ext}=dataUrlToBlob(patch.audioUrl);
     const path=`${courseId}/${index}-audio-${Date.now()}.${ext}`;
     await uploadWithProgress('session-media',path,blob,f=>onProgress?.('audio',f));
     row.audio_url=supabase.storage.from('session-media').getPublicUrl(path).data.publicUrl;row.audio_name=patch.audioName??null;
    }else if(patch.audioUrl===''){row.audio_url=null;row.audio_name=null}
   }
   const {error}=await supabase.from('session_media').upsert(row,{onConflict:'course_id,lesson_index'});
   if(error)throw error;
   await loadAll();
  }finally{setSavingSession(false)}
 };

 return <Context.Provider value={{lang,setLang,tr,tx:(t)=>pick(t,lang),courses,setCourses,saveSession,savingSession,addSession,saveStudy,user,role,signOut,completed,complete,notes,saveNote}}>{children}<Toaster position="bottom-right" richColors /></Context.Provider>
}
export function useElevation(){const context=useContext(Context);if(!context)throw new Error('ElevationProvider is required');return context}
