import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { GeolocationProvider } from "@/components/geolocation-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "ВетПоиск - Найдите лучшего ветеринара рядом",
  description:
    "Платформа для поиска проверенных ветеринарных клиник и врачей с отзывами реальных клиентов. Записывайтесь на прием онлайн в удобное время.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GeolocationProvider>{children}</GeolocationProvider>
      </body>
    </html>
  )
}
