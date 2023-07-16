import type { AppProps } from "next/app";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/contexts/AuthContext";
import { PT_Sans } from "next/font/google";
import { FavoriteProvider } from "@/contexts/FavoriteContext";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <Navbar>
          <div className={ptSans.className}>
            <Component {...pageProps} />
          </div>
        </Navbar>
      </FavoriteProvider>
    </AuthProvider>
  );
}
