import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloWrapper from "../components/ApolloWrapper";
import { AuthProvider } from "../contexts/AuthContext";
import { PageTransitionProvider } from "../contexts/PageTransitionContext";
import PageTransitionLoader from "../components/PageTransitionLoader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BadhoSa - Vehicle Rentals",
  description: "Find and rent bikes and cars easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
              <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ApolloWrapper>
            <AuthProvider>
              <PageTransitionProvider>
                <PageTransitionLoader />
                {children}
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  className="custom-toast-container"
                  toastClassName="custom-toast"
                  progressClassName="custom-toast-progress"
                />
              </PageTransitionProvider>
            </AuthProvider>
          </ApolloWrapper>
        </body>
    </html>
  );
}
