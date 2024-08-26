import './styles/globals.scss'
import {  Work_Sans } from 'next/font/google'
import Providers from './components/Providers'
import { Edu_VIC_WA_NT_Beginner } from 'next/font/google'
import { Kalam } from 'next/font/google'
import { Roboto } from 'next/font/google'
import { Indie_Flower } from 'next/font/google'

const roboto_mono = Roboto({
  subsets: ['latin'],
  weight: ['400']
})

const work_sans = Work_Sans({
  subsets: ['latin']
})

const edu_vic = Edu_VIC_WA_NT_Beginner({
  subsets: ['latin']
})

const kalam = Kalam({
  subsets: ['latin'],
  weight: '300'
})

const indie_flower = Indie_Flower({
  subsets: ['latin'],
  weight: '400'
})

export const metadata = {
  title: "Weclome to oceannote",
  description: "The lander page of oceannote",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className = {edu_vic.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
