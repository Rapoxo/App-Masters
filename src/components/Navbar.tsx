import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  GameController,
  Heart,
  House,
  List,
  SignIn,
  SignOut,
} from "phosphor-react";
import type IconType from "@/@types/IconType";
import { FavoriteContext } from "@/contexts/FavoriteContext";
import { AuthContext } from "@/contexts/AuthContext";

type MobileMenuProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

type NavItem = {
  name: string;
  icon: IconType;
  path: string;
};

const MobileMenu = ({ isOpen, setOpen }: MobileMenuProps) => {
  const { onlyFavorites, setOnlyFavorites } = useContext(FavoriteContext);
  const { user, signOut } = useContext(AuthContext);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLogged(!!user);
  }, [user]);

  useEffect(() => {
    setOpen(false);
    console.log(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <section>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`absolute w-full h-full z-10 bg-black/50 top-0 left-0 ${
          !isOpen && "hidden"
        }`}
      ></div>
      <div
        className={`flex flex-col w-[70vw] h-screen bg-indigo-700 -translate-x-full transition-all duration-300 absolute z-20 ${
          isOpen ? "translate-x-0" : "mr-1"
        }`}
      >
        <nav className="flex flex-col w-full h-full justify-between p-5">
          <ul className="flex flex-col gap-4 ">
            <li className="py-2">
              <span
                onClick={() => {
                  setOpen(false);
                  setOnlyFavorites(false);
                }}
                className="flex items-center gap-3 text-2xl font-bold text-indigo-20 cursor-pointer"
              >
                <House weight={!onlyFavorites ? "fill" : undefined} />
                Início
              </span>
            </li>

            <li className="py-2">
              <button
                onClick={() => {
                  setOnlyFavorites((prev) => !prev);
                  setOpen(false);
                }}
                className="flex items-center gap-3 text-2xl font-bold text-indigo-20"
              >
                <Heart weight={onlyFavorites ? "fill" : undefined} />
                Favoritos
              </button>
            </li>
          </ul>
          <ul className="flex flex-col gap-4 ">
            <li className="py-2">
              {!isLogged ? (
                <Link
                  className="flex items-center gap-3 text-2xl font-bold text-indigo-20"
                  href="/auth"
                >
                  <SignIn /> Entrar
                </Link>
              ) : (
                <span
                  onClick={() => {
                    signOut();
                    setOpen(false);
                    router.reload();
                  }}
                  className="flex items-center gap-3 text-2xl font-bold cursor-pointer"
                >
                  <SignOut /> Sair
                </span>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const { onlyFavorites, setOnlyFavorites } = useContext(FavoriteContext);
  const { user, signOut } = useContext(AuthContext);

  const [isLogged, setIsLogged] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLogged(!!user);
  }, [user]);

  return (
    <>
      <header>
        <MobileMenu isOpen={open} setOpen={setOpen} />
        <div className="flex justify-between items-center w-full p-4 bg-indigo-700 z-30 xl:px-48 xl:py-5">
          <span
            onClick={() => setOpen(true)}
            className="cursor-pointer md:hidden"
          >
            <List size={32} />
          </span>

          <h1
            onClick={() => {
              setOpen(false);
              setOnlyFavorites(false);
            }}
            className="flex items-center text-3xl cursor-pointer"
          >
            <GameController className="mr-2" size={32} />
            App Masters
          </h1>

          <ul className=" justify-between gap-5 items-center hidden sm:flex">
            <li className="hidden md:block">
              <button
                onClick={() => {
                  setOnlyFavorites((prev) => !prev);
                }}
                className="flex items-center gap-1 text-2xl font-bold text-indigo-20"
              >
                <Heart weight={onlyFavorites ? "fill" : undefined} />
                Favoritos
              </button>
            </li>

            <li className="py-2 ">
              {!isLogged ? (
                <Link
                  className="flex items-center gap-3 text-2xl font-bold text-indigo-20"
                  href="/auth"
                >
                  <SignIn /> Entrar
                </Link>
              ) : (
                <span
                  onClick={() => {
                    signOut();
                    setOpen(false);
                    router.reload();
                  }}
                  className="flex items-center gap-3 text-2xl font-bold cursor-pointer"
                >
                  <SignOut /> Sair
                </span>
              )}
            </li>

            <li>
              <a target="_blank" href="https://github.com/rapoxo">
                <svg
                  height="32"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="24"
                  data-view-component="true"
                >
                  <path
                    fill="#fff"
                    d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
                  ></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </>
  );
};

export default Navbar;
