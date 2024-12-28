import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/prof_space_components/sidebare/sidebar_Elements";
import { ModeToggle } from "@/components/mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage university resources",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:pl-[280px]">
              <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <div className="flex-1" />
                <ModeToggle />
              </header>
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
