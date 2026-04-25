import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chatster — Talk to Strangers",
  description: "Anonymous real-time chat with strangers around the world. Safe, ephemeral, and fun.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
