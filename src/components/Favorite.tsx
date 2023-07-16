import React, { useState, useContext, useMemo, useEffect } from "react";
import { useRouter } from "next/router";

import { Heart } from "phosphor-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/services/firebaseClient";
import { AuthContext } from "@/contexts/AuthContext";

type FavoriteProps = {
  value?: boolean;
  id: number;
  updateFavorites?: () => void;
};

const Favorite = ({ value, id, updateFavorites }: FavoriteProps) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [isOnFavorites, setIsOnFavorites] = useState(value);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setIsOnFavorites(value);
  }, [value]);

  const handleClick = async () => {
    if (!user) return router.push("/auth");

    try {
      const docRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(docRef);
      if (!userDoc.exists()) return;
      const newFavorites = {
        ...userDoc.data()?.favorites,
        [id]: !isOnFavorites,
      };
      updateDoc(docRef, {
        favorites: newFavorites,
      });
      setIsOnFavorites((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Heart
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:animate-pulse ease-in"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
      weight={isOnFavorites || hovering ? "fill" : undefined}
      fillOpacity={hovering && !isOnFavorites ? 0.7 : undefined}
      fill={!!user ? "red" : "gray"}
      color={!!user ? "white" : "gray"}
      size={24}
    />
  );
};

export default Favorite;
