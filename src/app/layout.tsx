import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "FellaFLIX",
  description: "A beautiful movie nerd style streaming website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col pt-[130px] sm:pt-16 pb-24 sm:pb-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
