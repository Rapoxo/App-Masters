import type { AppProps } from "next/app";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/contexts/AuthContext";
import { PT_Sans } from "next/font/google";
import { FavoriteProvider } from "@/contexts/FavoriteContext";
import ScrollToTop from "@/components/ScrollToTop";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <Navbar>
          <div className={`relative ${ptSans.className}`}>
            <ScrollToTop />
            <Component {...pageProps} />
          </div>
        </Navbar>
      </FavoriteProvider>
    </AuthProvider>
  );
}
