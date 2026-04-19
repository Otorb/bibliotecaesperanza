import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import Navbar from "@/Components/Navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Biblioteca Esperanza",
    template: "%s | Biblioteca Esperanza",
  },
  description:
    "Sistema de biblioteca para consulta y gestión de libros, préstamos y disponibilidad en tiempo real.",
  keywords: [
    "biblioteca",
    "libros",
    "préstamos",
    "catálogo de libros",
    "consultar libros",
    "disponibilidad de libros",
  ],
  authors: [{ name: "Biblioteca Esperanza" }],
  openGraph: {
    title: "Biblioteca Esperanza",
    description: "Consulta libros y disponibilidad en tiempo real",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        
        <ReduxProvider>
        {children}
        </ReduxProvider>
        
      </body>
    </html>
  );
}
