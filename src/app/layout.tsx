import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "FellaFLIX",
  description: "Watch Flic with FellaFLIX, a free movie streaming platform.",
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
          <main className="flex-grow flex flex-col pt-[130px] sm:pt-20 pb-24 sm:pb-0">
            {children}
          </main>
        </Providers>
        
        {/* Built-in basic AdBlocker */}
        <script dangerouslySetInnerHTML={{
          __html: `
            const blockedPatterns = [
                'doubleclick.net',
                'googlesyndication.com',
                'googleadservices.com',
                'adservice.google.com',
                'popads.net',
                'propellerads.com'
            ];

            function blockAds() {
                document.querySelectorAll('iframe, script, img').forEach(element => {
                    const src = element.src || '';

                    if (blockedPatterns.some(domain => src.includes(domain))) {
                        element.remove();
                    }
                });

                document.querySelectorAll(
                    '.ad, .ads, .advertisement, .advert, [id*="ad-"], [class*="ad-"]'
                ).forEach(element => {
                    element.remove();
                });
            }

            blockAds();

            const observer = new MutationObserver(blockAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
          `
        }} />
      </body>
    </html>
  );
}
