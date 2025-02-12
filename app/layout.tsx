import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className={`h-screen bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-50`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
