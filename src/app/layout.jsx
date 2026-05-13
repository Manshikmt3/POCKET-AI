import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

import AiAssistant from "@/components/ai-assistant";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "pocket ai",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <AiAssistant />
            <footer className="bg-green-50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>Made with 💗 by Manshi Kumawat</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>


      </html>
    </ClerkProvider>
  );
}
