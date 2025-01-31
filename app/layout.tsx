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
          className={`h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
