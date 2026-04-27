import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chatster",
  description: "Anonymous Chat",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
