import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
import MenuLeft from "@/components/layout/menu-left";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "light",
            themes: ["light"],
          }}
        >
          <div className="relative flex flex-col">
            <main className="light ">
              <section className="flex relative w-full">
                {/* <MenuLeft /> */}
                <div className="w-full inline-block">
                  <Navbar />
                  {children}
                </div>
              </section>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
