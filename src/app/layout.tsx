import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "microtailwind-utils";
import { Toaster } from "./_ui/toaster";

export const revalidate =  86400 // revalidate fetchs at least every 24 hours

const appFont = Poppins({
   subsets: ["latin"],
   display: "swap",
   weight: ['300', '400', '500', '600', '700'],
   variable: "--tf-app",
});

export const metadata: Metadata = {
   title: "CoachPyme",
   description: "Evalúa y mejora tu negocio",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   console.log("RootLayout");
   return (
      <html lang="es" className={cn(appFont.variable)}>
         <body className="tf-app">
            {children}
            <Toaster />
         </body>
      </html>
   );
}
