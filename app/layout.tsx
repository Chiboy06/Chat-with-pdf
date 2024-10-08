import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: "chat-with-pdf",
  description: "Chat with PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          <Toaster/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
