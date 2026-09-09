'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { initialCourses, pick, type Course, type Language, type Localized } from './data';
type Note = { id: string; course: string; lesson: number; text: string };
type State = { lang:Language; setLang:(v:Language)=>void; tr:(en:string,es:string,de:string)=>string; tx:(t:Localized)=>string; courses:Course[]; setCourses:React.Dispatch<React.SetStateAction<Course[]>>; completed:string[]; complete:(key:string)=>void; notes:Note[]; saveNote:(note:Note)=>void };
const Context=createContext<State|null>(null);
export function ElevationProvider({children}:{children:ReactNode}) {
 const [lang,setLanguage]=useState<Language>('en');
 const [courses,setCourses]=useState(initialCourses);
 const [completed,setCompleted]=useState(['interpretation-0','romans-0','romans-1','romans-2']);
 const [notes,setNotes]=useState<Note[]>([]);
 useEffect(()=>{const saved=localStorage.getItem('elevation-language');if(saved==='en'||saved==='es'||saved==='de')setLanguage(saved)},[]);
 useEffect(()=>{document.documentElement.lang=lang},[lang]);
 const setLang=(v:Language)=>{setLanguage(v);localStorage.setItem('elevation-language',v)};
 const tr=(en:string,es:string,de:string)=>pick([en,es,de],lang);
 const saveNote=(note:Note)=>setNotes(old=>[...old.filter(n=>n.id!==note.id),note]);
 return <Context.Provider value={{lang,setLang,tr,tx:(t)=>pick(t,lang),courses,setCourses,completed,complete:(key)=>setCompleted(old=>old.includes(key)?old.filter(k=>k!==key):[...old,key]),notes,saveNote}}>{children}<Toaster position="bottom-right" richColors /></Context.Provider>
}
export function useElevation(){const context=useContext(Context);if(!context)throw new Error('ElevationProvider is required');return context}
