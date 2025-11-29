import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Farcaster Gas Checker",
  description: "Discover how much gas any Farcaster user has spent on Ethereum and Base",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
