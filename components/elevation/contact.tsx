'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Languages, MessageCircle, Users, Eye } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useElevation } from './provider';
import { PublicHeader, PublicFooter, ExploreDock, Eyebrow } from './shared';

export function ContactPage() {
  const { tr } = useElevation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('study');
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(false);
  const topics = [
    ['study', tr('A Bible study question', 'Una pregunta sobre el estudio bíblico', 'Eine Frage zum Bibelstudium')],
    ['membership', tr('Membership & access', 'Membresía y acceso', 'Mitgliedschaft und Zugang')],
    ['translation', tr('Languages & translation', 'Idiomas y traducción', 'Sprachen und Übersetzung')],
    ['general', tr('Something else', 'Otro tema', 'Ein anderes Anliegen')],
  ];
  const currentTopic = topics.find(([value]) => value === topic)?.[1];

  return <>
    <PublicHeader />
    <main className="contact-page">
      <section className="contact-hero">
        <img src="/images/summit.png" alt="" aria-hidden="true" />
        <div className="site-container contact-hero-content">
          <Eyebrow gold>{tr('Let’s connect', 'Conversemos', 'Kommen wir ins Gespräch')}</Eyebrow>
          <h1>{tr('Every question is', 'Cada pregunta es', 'Jede Frage ist')}<em>{tr('a place to begin.', 'un punto de partida.', 'ein neuer Anfang.')}</em></h1>
          <p>{tr('A question about Scripture. A new step in your study. A conversation worth having.', 'Una pregunta sobre la Escritura. Un nuevo paso en tu estudio. Una conversación que vale la pena.', 'Eine Frage zur Schrift. Ein neuer Schritt in deinem Studium. Ein Gespräch, das sich lohnt.')}</p>
        </div>
      </section>

      <div className="site-container contact-layout">
        <aside className="contact-aside">
          <Eyebrow>{tr('Here to help', 'Estamos para ayudarte', 'Für dich da')}</Eyebrow>
          <h2>{tr('Clarity grows through conversation.', 'La claridad crece con la conversación.', 'Klarheit wächst im Gespräch.')}</h2>
          <p>{tr('Whether you’re opening your Bible for the first time or working through a difficult passage, there’s room for your questions here.', 'Ya sea que abras tu Biblia por primera vez o estudies un pasaje difícil, aquí hay espacio para tus preguntas.', 'Ob du deine Bibel zum ersten Mal öffnest oder einen schwierigen Abschnitt durcharbeitest: Hier ist Raum für deine Fragen.')}</p>
          <div className="contact-topics">
            <div><BookOpen /><section><h3>{tr('The teaching', 'La enseñanza', 'Die Lehre')}</h3><p>{tr('Questions about a study, a passage, or the bigger picture.', 'Preguntas sobre un estudio, un pasaje o el panorama completo.', 'Fragen zu einer Studie, einer Bibelstelle oder dem Gesamtbild.')}</p></section></div>
            <div><Users /><section><h3>{tr('Your membership', 'Tu membresía', 'Deine Mitgliedschaft')}</h3><p>{tr('Finding your way around the learning experience.', 'Cómo orientarte en la experiencia de aprendizaje.', 'Orientierung in deiner Lernerfahrung.')}</p></section></div>
            <div><Languages /><section><h3>{tr('Across languages', 'Entre idiomas', 'Über Sprachgrenzen hinweg')}</h3><p>{tr('English, Spanish, or German. Start in your own words.', 'Inglés, español o alemán. Empieza con tus propias palabras.', 'Englisch, Spanisch oder Deutsch. Beginne mit deinen eigenen Worten.')}</p></section></div>
          </div>
          <Link href="/studies" className="text-link">{tr('Find your next study', 'Encuentra tu próximo estudio', 'Entdecke deine nächste Studie')}<ArrowUpRight /></Link>
        </aside>

        <section className="contact-form-card">
          <div className="contact-form-heading"><span><MessageCircle /></span><div><h2>{tr('What’s on your mind?', '¿Qué tienes en mente?', 'Was beschäftigt dich?')}</h2><p>{tr('Start the conversation here.', 'Comienza la conversación aquí.', 'Beginne hier das Gespräch.')}</p></div></div>
          <form className="contact-form" onSubmit={event => { event.preventDefault(); setReview(true); }}>
            <div className="contact-form-row">
              <label htmlFor="contact-name">{tr('Your name', 'Tu nombre', 'Dein Name')}<Input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder={tr('First and last name', 'Nombre y apellido', 'Vor- und Nachname')} /></label>
              <label htmlFor="contact-email">{tr('Email address', 'Correo electrónico', 'E-Mail-Adresse')}<Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            </div>
            <label htmlFor="contact-topic">{tr('How can we help?', '¿Cómo podemos ayudarte?', 'Wie können wir helfen?')}<Select value={topic} onValueChange={setTopic}><SelectTrigger id="contact-topic"><SelectValue /></SelectTrigger><SelectContent>{topics.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label>
            <label htmlFor="contact-message">{tr('Your message', 'Tu mensaje', 'Deine Nachricht')}<Textarea id="contact-message" name="message" rows={6} required minLength={5} maxLength={5000} value={message} onChange={e => setMessage(e.target.value)} placeholder={tr('Tell us a little about your question…', 'Cuéntanos un poco sobre tu pregunta…', 'Erzähl uns etwas über deine Frage…')} /></label>
            <div className="contact-form-footer"><p><Eye />{tr('Form preview. Messages aren’t sent yet.', 'Vista previa del formulario. Los mensajes aún no se envían.', 'Formularvorschau. Nachrichten werden noch nicht versendet.')}</p><Button type="submit" className="button dark">{tr('Review message', 'Revisar mensaje', 'Nachricht prüfen')}<ArrowRight /></Button></div>
          </form>
        </section>
      </div>
    </main>
    <PublicFooter />
    <ExploreDock />
    <Dialog open={review} onOpenChange={setReview}><DialogContent className="editor-dialog contact-review"><DialogTitle>{tr('Your message preview', 'Vista previa de tu mensaje', 'Vorschau deiner Nachricht')}</DialogTitle><DialogDescription>{tr('Nothing has been sent. Review your message below or return to make changes.', 'No se ha enviado nada. Revisa tu mensaje o vuelve para hacer cambios.', 'Es wurde nichts versendet. Prüfe deine Nachricht oder kehre zum Bearbeiten zurück.')}</DialogDescription><dl><div><dt>{tr('From', 'De', 'Von')}</dt><dd>{name}<span>{email}</span></dd></div><div><dt>{tr('Topic', 'Tema', 'Thema')}</dt><dd>{currentTopic}</dd></div></dl><p className="contact-message-preview">{message}</p><DialogClose asChild><Button className="button dark">{tr('Back to the form', 'Volver al formulario', 'Zurück zum Formular')}</Button></DialogClose></DialogContent></Dialog>
  </>;
}
