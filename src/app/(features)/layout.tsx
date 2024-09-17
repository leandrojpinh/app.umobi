import { Navigation } from "@/components/ui/Navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/ui/Footer";
import { navigation } from "@/constants";

export const metadata: Metadata = {
  title: navigation.appName,
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main className="flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
