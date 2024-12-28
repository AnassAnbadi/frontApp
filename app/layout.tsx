// app/layout.tsx
import "./globals.css";
export const metadata = {
  title: "Dashboard",
  description: "Choose between Admin and Professor spaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
