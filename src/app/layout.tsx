import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
export const metadata = {
    title: {
        default: "Rukn Books — Online Bookstore in Algeria",
        template: "%s | Rukn Books",
    },
    description: "Rukn Books — thousands of English, French and Arabic books: classics, fantasy, philosophy, kids and more. Fast delivery across Algeria.",
    icons: { icon: "/favicon.ico" },
};
export default function RootLayout({ children }: { children: ReactNode }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            {children}
            <Toaster position="top-center" richColors closeButton/>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>);
}
