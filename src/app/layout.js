"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body
        style={{
          backgroundImage:
            "url('https://media.discordapp.net/attachments/1197323344937234464/1229457882588647536/bgphoto.png?ex=662fc0e1&is=661d4be1&hm=19525f4cebbe33f68bb5595e95905c365a9be74214146080168a8b1a616971c6&=&format=webp&quality=lossless&width=1291&height=726')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "#f4e8c4",
          minHeight: "141vh",
        }}
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
