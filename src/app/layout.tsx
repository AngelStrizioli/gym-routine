import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym Routine App",
  description: "This is an app for personal use",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
