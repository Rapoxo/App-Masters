import type { AppProps } from "next/app";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar>
        <Component {...pageProps} />
      </Navbar>
    </AuthProvider>
  );
}
