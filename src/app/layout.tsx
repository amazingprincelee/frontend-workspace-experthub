//app layout

import type { Metadata } from "next";
import "./globals.css";
import FooterNav from "@/components/FooterNav";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider
import NavbarSwitcher from "@/components/NavSwitcher";

export const metadata: Metadata = {
  title: "EXPERTHUB INSTITUTE",
  description:
    "We are determined to raise the next generation of global leaders and empower youths to harness the immense power of technology...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavbarSwitcher />
          {children} 
          <FooterNav />
        </AuthProvider>
      </body>
    </html>
  );
}
