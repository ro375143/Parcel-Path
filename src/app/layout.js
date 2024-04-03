'use client'
import { Inter } from "next/font/google";
import SessionProvider from "./SessionProvider";
import './globals.css'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import './globals.css'

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className={inter.className} style={{backgroundColor: '#f4e8c4', minHeight: '100vh'}}>
      <Navbar />
      <div className="flex-1">
          <SessionProvider>
            {children}
          </SessionProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
