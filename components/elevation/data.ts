export type Language = 'en' | 'es' | 'de';
export type Localized = [string, string, string];
export const pick = (text: Localized, lang: Language) => text[lang === 'en' ? 0 : lang === 'es' ? 1 : 2];
export type Course = { id: string; title: Localized; subtitle: Localized; description: Localized; count: number; theme: string; category: 'foundations' | 'new-testament' | 'prophecy'; status: 'preview' | 'draft'; lessons: Localized[]; videos?: string[]; images?: string[]; descriptions?: Localized[]; audio?: string[]; audioNames?: string[] };
/** Hosted video link for a session (index-aligned with lessons). Accepts a direct file URL (mp4/webm/m3u8), a YouTube link, or a Vimeo link. */
export const lessonVideo = (course: Course, index: number) => (course.videos?.[index] ?? '').trim();
/** Custom graphic shown behind the player for a session (index-aligned with lessons). A URL or an uploaded data URL. */
export const lessonImage = (course: Course, index: number) => (course.images?.[index] ?? '').trim();
/** Session-specific description shown under the player, in the given language. */
export const lessonDescription = (course: Course, index: number, lang: Language) => { const d = course.descriptions?.[index]; return d ? pick(d, lang).trim() : ''; };
/** Downloadable audio for a session (index-aligned with lessons). A URL or an uploaded data URL. */
export const lessonAudio = (course: Course, index: number) => (course.audio?.[index] ?? '').trim();
/** Display filename for the uploaded audio, if any. */
export const lessonAudioName = (course: Course, index: number) => (course.audioNames?.[index] ?? '').trim();
export const initialCourses: Course[] = [
 {id:'revelation',title:['Revelation & the End Times','Apocalipsis y el fin de los tiempos','Offenbarung und die Endzeit'],subtitle:['The whole picture. Finally in focus.','Todo el panorama. Por fin claro.','Das ganze Bild. Endlich klar.'],description:['Put the prophets, the words of Jesus, and Revelation in their proper order. Follow the text and see how the story connects.','Ordena los profetas, las palabras de Jesús y Apocalipsis. Sigue el texto y descubre cómo se conecta la historia.','Ordne die Propheten, die Worte Jesu und die Offenbarung ein. Folge dem Text und erkenne die Zusammenhänge.'],count:6,theme:'revelation',category:'prophecy',status:'preview',lessons:[['A revelation of Jesus Christ','Una revelación de Jesucristo','Eine Offenbarung Jesu Christi'],['Reading prophecy in context','Leer la profecía en contexto','Prophetie im Kontext lesen'],['The letters to the churches','Las cartas a las iglesias','Die Briefe an die Gemeinden'],['The throne and the Lamb','El trono y el Cordero','Der Thron und das Lamm'],['Seeing the sequence','Entender la secuencia','Die Reihenfolge erkennen'],['The words of Jesus','Las palabras de Jesús','Die Worte Jesu']]}
];
export const previewProfile = { name: 'Troy Johnson', firstName: 'Troy', initials: 'TJ', image: '/images/troy-johnson.jpg' };
export const sampleMembers = [
 {id:1,name:previewProfile.name,email:'troy@example.com',lang:'EN',plan:'Free',progress:35,active:true,initials:previewProfile.initials},
 {id:2,name:'Sofia Reyes',email:'sofia@example.com',lang:'ES',plan:'Supporter',progress:72,active:true,initials:'SR'},
 {id:3,name:'Daniel Weber',email:'daniel@example.com',lang:'DE',plan:'Free',progress:48,active:true,initials:'DW'},
 {id:4,name:'Grace Williams',email:'grace@example.com',lang:'EN',plan:'Supporter',progress:91,active:true,initials:'GW'},
 {id:5,name:'Mateo Garcia',email:'mateo@example.com',lang:'ES',plan:'Free',progress:12,active:false,initials:'MG'},
 {id:6,name:'Emma Fischer',email:'emma@example.com',lang:'DE',plan:'Free',progress:60,active:true,initials:'EF'}
];
