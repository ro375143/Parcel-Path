'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import '@/app/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}