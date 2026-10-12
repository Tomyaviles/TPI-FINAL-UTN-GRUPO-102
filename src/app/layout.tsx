import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { obtenerPerfil } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestión Gimnasios",
  description: "Sistema de gestión para gimnasios multisede",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // En el login no hay sesión, así que esto da null y el menú no se muestra igual
  const perfil = await obtenerPerfil();

  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar nombre={perfil?.nombre ?? null} rol={perfil?.rol ?? null} />
          <main className="flex-1 bg-slate-50 p-4 text-slate-900 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
