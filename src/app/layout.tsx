import "../styles/globals.css";

import type { Metadata } from "next";
import { Inter, Signika, Staatliches } from "next/font/google";
import { Providers } from "@/contexts/providers";
import { navigation } from "@/constants";

const inter = Inter({ subsets: ["latin"], weight: ['400', '600'] });
const signika = Signika({ subsets: ['latin'], display: 'swap', weight: ['400', '700'] });
const staatliches = Staatliches({ subsets: ['latin'], display: 'swap', weight: '400' });

export const metadata: Metadata = {
  title: navigation.appName
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${signika.className} ${staatliches.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
