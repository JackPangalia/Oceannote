import './styles/globals.scss'
import { Roboto_Mono, Work_Sans } from 'next/font/google'
import Providers from "./components/providers";

const roboto_mono = Work_Sans({
  subsets: ['latin']
})

export const metadata = {
  title: "Weclome to oceannote",
  description: "The lander page of oceannote",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto_mono.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
