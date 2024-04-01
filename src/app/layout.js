'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import './globals.css'


export default function RootLayout({ children }) {
  return (
    <>
      <Navbar isLoggedIn={true} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
