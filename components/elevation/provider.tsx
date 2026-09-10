'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { initialCourses, pick, type Course, type Language, type Localized } from './data';
type Note = { id: string; course: string; lesson: number; text: string };
type State = { lang:Language; setLang:(v:Language)=>void; tr:(en:string,es:string,de:string)=>string; tx:(t:Localized)=>string; courses:Course[]; setCourses:React.Dispatch<React.SetStateAction<Course[]>>; updateSessionVideo:(courseId:string,index:number,url:string)=>void; completed:string[]; complete:(key:string)=>void; notes:Note[]; saveNote:(note:Note)=>void };
const Context=createContext<State|null>(null);
const VIDEO_KEY='elevation-session-videos';
// Session video links are kept in the browser so admin edits survive a page reload until a backend is connected.
function applyStoredVideos(courses:Course[],map:Record<string,string[]>):Course[]{
 return courses.map(c=>Array.isArray(map[c.id])?{...c,videos:c.lessons.map((_,i)=>map[c.id][i]??c.videos?.[i]??'')}:c);
}
function persistVideos(courses:Course[]){
 try{const map:Record<string,string[]>={};for(const c of courses){if(c.videos&&c.videos.some(Boolean))map[c.id]=c.lessons.map((_,i)=>c.videos?.[i]??'');}localStorage.setItem(VIDEO_KEY,JSON.stringify(map));}catch{}
}
export function ElevationProvider({children}:{children:ReactNode}) {
 const [lang,setLanguage]=useState<Language>('en');
 const [courses,setCourses]=useState(initialCourses);
 const [completed,setCompleted]=useState(['interpretation-0','romans-0','romans-1','romans-2']);
 const [notes,setNotes]=useState<Note[]>([]);
 useEffect(()=>{const saved=localStorage.getItem('elevation-language');if(saved==='en'||saved==='es'||saved==='de')setLanguage(saved)},[]);
 // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate saved links after mount to avoid an SSR/client mismatch
 useEffect(()=>{try{const raw=localStorage.getItem(VIDEO_KEY);if(raw){const map=JSON.parse(raw);if(map&&typeof map==='object')setCourses(cs=>applyStoredVideos(cs,map));}}catch{}},[]);
 useEffect(()=>{document.documentElement.lang=lang},[lang]);
 const setLang=(v:Language)=>{setLanguage(v);localStorage.setItem('elevation-language',v)};
 const tr=(en:string,es:string,de:string)=>pick([en,es,de],lang);
 const saveNote=(note:Note)=>setNotes(old=>[...old.filter(n=>n.id!==note.id),note]);
 const updateSessionVideo=(courseId:string,index:number,url:string)=>setCourses(old=>{const next=old.map(c=>c.id!==courseId?c:{...c,videos:c.lessons.map((_,i)=>i===index?url.trim():(c.videos?.[i]??''))});persistVideos(next);return next;});
 return <Context.Provider value={{lang,setLang,tr,tx:(t)=>pick(t,lang),courses,setCourses,updateSessionVideo,completed,complete:(key)=>setCompleted(old=>old.includes(key)?old.filter(k=>k!==key):[...old,key]),notes,saveNote}}>{children}<Toaster position="bottom-right" richColors /></Context.Provider>
}
export function useElevation(){const context=useContext(Context);if(!context)throw new Error('ElevationProvider is required');return context}
