import "./global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Menu App",
  description: "Experience 3D food previews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 👇 Force dark tokens by adding className="dark"
    <html lang="en" className="dark" suppressHydrationWarning>

      <body>
        {children}
      </body>
    </html>
  );
}
