import React, { useContext, useRef, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";

import { SyncLoader } from "react-spinners";

const Auth = () => {
  const [signInMode, setSignInMode] = useState(true);
  const { signIn, signUp, error, loading } = useContext(AuthContext);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [email, password] = [
      emailRef.current?.value,
      passwordRef.current?.value,
    ];
    if (!email || !password) return;
    signInMode ? signIn({ email, password }) : signUp({ email, password });
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <section className="flex flex-col gap-2 p-4 w-96 h-[70%] mx-2 md:h-[40%] bg-indigo-50 rounded-lg text-black ">
        <form
          className="flex flex-col h-full justify-between"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-3xl mb-1">
            {signInMode ? "Entrar" : "Cadastrar"}
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                ref={emailRef}
                className={`${
                  error && "outline outline-1 outline-red-600"
                } p-2 rounded-md bg-indigo-200 placeholder:text-gray-600`}
                type="email"
                name="email"
                id="email"
                placeholder="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Senha</label>
              <input
                ref={passwordRef}
                className={`${
                  error && "outline outline-1 outline-red-600"
                } p-2 rounded-md bg-indigo-200 placeholder:text-gray-600`}
                type="password"
                name="password"
                id="password"
                placeholder="********"
              />
            </div>
          </div>

          <button
            className="p-2 w-full text-white rounded-md bg-indigo-700 hover:bg-indigo-600 "
            type="submit"
          >
            {loading ? (
              <SyncLoader color="#fff" size={8} />
            ) : signInMode ? (
              "Entrar"
            ) : (
              "Cadastrar"
            )}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <span>
            { signInMode ?  "Ainda não tem uma conta?" : "Já tem uma conta?" }
            {" "}
            <span onClick={() => setSignInMode((prev) => !prev) } className="hover:underline text-sm text-indigo-600 cursor-pointer " >clique aqui</span>
          </span>
        </form>

        
      </section>
    </div>
  );
};

export default Auth;
