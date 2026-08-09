import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "SiteBank – NRI Property Management",
  description: "Premium property management platform for NRIs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAF6EF] text-[#2C3E38] min-h-screen`}>
        <AppProvider>
          <Header />
          <div className="pt-16 min-h-screen flex flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
