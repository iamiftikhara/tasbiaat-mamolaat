import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { MultilingualProvider } from '@/hooks/useMultilingual';
import { LoadingProvider } from '@/components/Loaders';
import Layout from '@/components/Layout';
import AuthMiddleware from '@/components/AuthMiddleware';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tasbiaat & Mamolaat - Islamic Spiritual Tracking",
  description: "A comprehensive platform for tracking daily Islamic spiritual practices and progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <MultilingualProvider>
            <AuthProvider>
              <AuthMiddleware>
                <Layout>
                  {children}
                </Layout>
              </AuthMiddleware>
            </AuthProvider>
          </MultilingualProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
