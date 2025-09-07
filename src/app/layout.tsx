import { TrekkingProvider } from "@/context/TrekkingContext";
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TrekkingProvider>{children}</TrekkingProvider>
      </body>
    </html>
  );
}