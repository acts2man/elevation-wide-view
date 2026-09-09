import type { Metadata } from 'next';
import './globals.css';
import { ElevationProvider } from '@/components/elevation/provider';
export const metadata:Metadata={title:{default:'Elevation Bible Study — The Thousand-Foot View',template:'%s | Elevation Bible Study'},description:'Step back, and Scripture snaps into focus. Explore the Bible book by book, in context, in English, Spanish, and German.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=Manrope:wght@400;500;600;650;700;750;800&family=Playfair+Display:ital,wght@1,500&display=swap" rel="stylesheet"/></head><body><ElevationProvider>{children}</ElevationProvider></body></html>}
