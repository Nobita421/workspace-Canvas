import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "Prime Station - Trading Workspace",
  description: "Collaborative trading canvas for market analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
