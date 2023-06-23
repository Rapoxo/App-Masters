import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>App Masters</title>
      </Head>
      <main className={`${inter.className}`}>
        <h1>App Masters</h1>
      </main>
    </>
  );
}
