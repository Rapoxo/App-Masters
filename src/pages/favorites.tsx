import React, { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import Link from "next/link";

const Favorites = () => {
  const { user, loading } = useContext(AuthContext);
  return loading ? (
    <Loader />
  ) : !user ? (
    <div>
      Você não está autenticado{" "}
      <Link className="text-indigo-400 hover:underline" href="/auth">
        clique aqui
      </Link>{" "}
      para fazer login
    </div>
  ) : (
    <div>Favoritos</div>
  );
};

export default Favorites;
