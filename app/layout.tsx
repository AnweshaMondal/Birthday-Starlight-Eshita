import type { Metadata } from "next";
import "./globals.css";
import "aos/dist/aos.css";

export const metadata: Metadata = {
  title: "A Birthday Written in the Stars",
  description: "A little universe made especially for you.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
