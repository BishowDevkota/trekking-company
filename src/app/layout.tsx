// src/app/layout.tsx
import "./globals.css";


export const metadata = {
  title: "My Hybrid Website",
  description: "Next.js + WordPress Blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-0 px-0 py-0">{children}</main>
      </body>
    </html>
  );
}
