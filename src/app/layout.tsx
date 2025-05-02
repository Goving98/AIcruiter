import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-cruiter",
  description: "Intelligent Hiring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: '#4338ca',
                color: '#ffffff',
              },
            },
            error: {
              style: {
                background: '#dc2626',
                color: '#ffffff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}