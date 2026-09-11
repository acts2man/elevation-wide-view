'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { initialCourses, pick, type Course, type Language, type Localized } from './data';
type Note = { id: string; course: string; lesson: number; text: string };
type SessionMediaPatch = { title?: string; videoUrl?: string; description?: string; image?: string; audioUrl?: string; audioName?: string };
type State = { lang:Language; setLang:(v:Language)=>void; tr:(en:string,es:string,de:string)=>string; tx:(t:Localized)=>string; courses:Course[]; setCourses:React.Dispatch<React.SetStateAction<Course[]>>; saveSession:(courseId:string,index:number,patch:SessionMediaPatch)=>Promise<void>; savingSession:boolean; completed:string[]; complete:(key:string)=>void; notes:Note[]; saveNote:(note:Note)=>void };
const Context=createContext<State|null>(null);

type SessionRow = { course_id:string; lesson_index:number; title_en?:string|null; title_es?:string|null; title_de?:string|null; video_url?:string|null; image_url?:string|null; description_en?:string|null; description_es?:string|null; description_de?:string|null; audio_url?:string|null; audio_name?:string|null };

/** Session titles, video links, graphics, descriptions, and audio all live in Supabase now, so every open screen (any tab, any device) sees the same data. */
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

export function ElevationProvider({children}:{children:ReactNode}) {
 const [lang,setLanguage]=useState<Language>('en');
 const [courses,setCourses]=useState(initialCourses);
 const [completed,setCompleted]=useState(['interpretation-0','romans-0','romans-1','romans-2']);
 const [notes,setNotes]=useState<Note[]>([]);
 const [savingSession,setSavingSession]=useState(false);
 useEffect(()=>{const saved=localStorage.getItem('elevation-language');if(saved==='en'||saved==='es'||saved==='de')setLanguage(saved)},[]);
 const loadSessionMedia=async()=>{
  try{
   const res=await fetch('/api/session-media',{cache:'no-store'});
   const data=await res.json();
   if(data?.ok&&Array.isArray(data.rows))setCourses(cs=>applySessionRows(cs,data.rows));
  }catch{}
 };
 useEffect(()=>{
  loadSessionMedia();
  // No realtime channel yet, so poll and refresh on focus: this is how every open screen (this device or another) picks up admin edits.
  const interval=window.setInterval(loadSessionMedia,20000);
  window.addEventListener('focus',loadSessionMedia);
  return ()=>{window.clearInterval(interval);window.removeEventListener('focus',loadSessionMedia)};
 },[]);
 useEffect(()=>{document.documentElement.lang=lang},[lang]);
 const setLang=(v:Language)=>{setLanguage(v);localStorage.setItem('elevation-language',v)};
 const tr=(en:string,es:string,de:string)=>pick([en,es,de],lang);
 const saveNote=(note:Note)=>setNotes(old=>[...old.filter(n=>n.id!==note.id),note]);
 const saveSession=async(courseId:string,index:number,patch:SessionMediaPatch)=>{
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
   const image=patch.image===undefined?undefined:patch.image.startsWith('data:')?{dataUrl:patch.image}:patch.image===''?{remove:true}:undefined;
   const audioBody=patch.audioUrl===undefined?undefined:patch.audioUrl.startsWith('data:')?{dataUrl:patch.audioUrl,name:patch.audioName}:patch.audioUrl===''?{remove:true}:undefined;
   const res=await fetch('/api/admin/session-media',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({courseId,lessonIndex:index,lang,title:patch.title,videoUrl:patch.videoUrl,description:patch.description,image,audio:audioBody})});
   const data=await res.json().catch(()=>({ok:false}));
   if(data?.ok)await loadSessionMedia();
  }finally{setSavingSession(false)}
 };
 return <Context.Provider value={{lang,setLang,tr,tx:(t)=>pick(t,lang),courses,setCourses,saveSession,savingSession,completed,complete:(key)=>setCompleted(old=>old.includes(key)?old.filter(k=>k!==key):[...old,key]),notes,saveNote}}>{children}<Toaster position="bottom-right" richColors /></Context.Provider>
}
export function useElevation(){const context=useContext(Context);if(!context)throw new Error('ElevationProvider is required');return context}
