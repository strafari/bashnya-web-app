import "./globals.css";
import { ReactNode } from "react";
import { Montserrat, Unbounded } from 'next/font/google'
import ClientLayout from "./ClientLayout";
import AuthProvider from "../components/AuthProvider";
// export const metadata = {
//   title: "Башня ",
//   description:
//     "Профессиональная забота о питомцах в Норильске: «Хакуна Матата» — диагностика, лечение и вакцинация. Оставьте заявку онлайн!",
//   applicationName: "Хакуна Матата",
//   keywords: [
//     "ветклиника норильск",
//     "хакуна матата",
//     "ветеринарная клиника",
//     "ветеринар",
//     "лечение кошек",
//     "ветеринарные услуги",
//     "хакуна матата норильск",
//   ],
//   icons: {
//     icon: "/favicon.png",
//     shortcut: "/favicon.png",
//   },
// };

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  display: 'swap',
  variable: '--font-montserrat',
});
const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['200','300','400','500','600','700','800','900'],
  display: 'swap',
  variable: '--font-unbounded',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const classNames = `${montserrat.variable} ${unbounded.variable}`
  
  return (
    <html lang="ru" className={classNames}>
      <body>{children}</body>
    </html>
  )
}


// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="ru">
//       <head>
//         <meta name="yandex-verification" content="6b302a6f52754f1c" />
//       </head>
//       <body className="min-h-screen flex flex-col">
//         <AuthProvider>
//           <ClientLayout>{children}</ClientLayout>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


