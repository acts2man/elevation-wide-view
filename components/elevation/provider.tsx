'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { Toaster } from '@/components/ui/sonner';
import { supabaseBrowser } from '@/lib/supabase/client';
import { initialCourses, pick, type Course, type Language, type Localized } from './data';

type Note = { id: string; course: string; lesson: number; text: string };
type Role = 'admin' | 'member' | null;
type SessionMediaPatch = { title?: string; videoUrl?: string; description?: string; image?: string; audioUrl?: string; audioName?: string };
type State = {
 lang:Language; setLang:(v:Language)=>void; tr:(en:string,es:string,de:string)=>string; tx:(t:Localized)=>string;
 courses:Course[]; setCourses:React.Dispatch<React.SetStateAction<Course[]>>;
 saveSession:(courseId:string,index:number,patch:SessionMediaPatch)=>Promise<void>; savingSession:boolean;
 user:User|null; role:Role; signOut:()=>Promise<void>;
 completed:string[]; complete:(key:string)=>void; notes:Note[]; saveNote:(note:Note)=>void;
};
const Context=createContext<State|null>(null);

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

 const loadSessionMedia=async()=>{
  const {data,error}=await supabase.from('session_media').select('*');
  if(!error&&data)setCourses(cs=>applySessionRows(cs,data as SessionRow[]));
 };
 useEffect(()=>{
  loadSessionMedia();
  const interval=window.setInterval(loadSessionMedia,20000);
  window.addEventListener('focus',loadSessionMedia);
  return ()=>{window.clearInterval(interval);window.removeEventListener('focus',loadSessionMedia)};
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
    supabase.from('profiles').select('role').eq('id',u.id).single().then(({data:p})=>setRole((p?.role as Role)??'member'));
    loadOwnData(u.id);
   }
  });
  const {data:sub}=supabase.auth.onAuthStateChange((_event,session)=>{
   const u=session?.user??null;setUser(u);
   if(u){
    supabase.from('profiles').select('role').eq('id',u.id).single().then(({data:p})=>setRole((p?.role as Role)??'member'));
    loadOwnData(u.id);
   }else{setRole(null);setCompleted([]);setNotes([])}
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
   const row:Record<string,unknown>={course_id:courseId,lesson_index:index,updated_at:new Date().toISOString()};
   if(patch.title!==undefined)row[`title_${lang}`]=patch.title;
   if(patch.videoUrl!==undefined)row.video_url=patch.videoUrl.trim();
   if(patch.description!==undefined)row[`description_${lang}`]=patch.description;
   if(patch.image!==undefined){
    if(patch.image.startsWith('data:')){
     const {blob,ext}=dataUrlToBlob(patch.image);
     const path=`${courseId}/${index}-image-${Date.now()}.${ext}`;
     const {error:upErr}=await supabase.storage.from('session-media').upload(path,blob,{contentType:blob.type,upsert:true});
     if(!upErr)row.image_url=supabase.storage.from('session-media').getPublicUrl(path).data.publicUrl;
    }else if(patch.image===''){row.image_url=null}
   }
   if(patch.audioUrl!==undefined){
    if(patch.audioUrl.startsWith('data:')){
     const {blob,ext}=dataUrlToBlob(patch.audioUrl);
     const path=`${courseId}/${index}-audio-${Date.now()}.${ext}`;
     const {error:upErr}=await supabase.storage.from('session-media').upload(path,blob,{contentType:blob.type,upsert:true});
     if(!upErr){row.audio_url=supabase.storage.from('session-media').getPublicUrl(path).data.publicUrl;row.audio_name=patch.audioName??null}
    }else if(patch.audioUrl===''){row.audio_url=null;row.audio_name=null}
   }
   const {error}=await supabase.from('session_media').upsert(row,{onConflict:'course_id,lesson_index'});
   if(!error)await loadSessionMedia();
  }finally{setSavingSession(false)}
 };

 return <Context.Provider value={{lang,setLang,tr,tx:(t)=>pick(t,lang),courses,setCourses,saveSession,savingSession,user,role,signOut,completed,complete,notes,saveNote}}>{children}<Toaster position="bottom-right" richColors /></Context.Provider>
}
export function useElevation(){const context=useContext(Context);if(!context)throw new Error('ElevationProvider is required');return context}
