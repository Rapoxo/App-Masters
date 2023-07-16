import React, { useMemo, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { AnimatePresence, motion } from "framer-motion";

import { AuthContext } from "@/contexts/AuthContext";
import { firestore } from "@/services/firebaseClient";
import Card from "@/components/Card";
import { FavoriteContext } from "@/contexts/FavoriteContext";

type GameListProps = {
  games: Game[];
  filterParams: FilterParams;
};

const GameList = ({ games, filterParams }: GameListProps) => {
  const { user } = useContext(AuthContext);
  const { onlyFavorites } = useContext(FavoriteContext);

  const [favoriteList, setFavoriteList] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [length, setLength] = useState(12);

  const getRatings = async () => {
    if (!user) return;
    const docRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(docRef);
    if (!userDoc.exists()) return;
    const ratings = userDoc.data()?.ratings;
    setRatings(ratings);
  };

  const getFavorites = async () => {
    if (!user) return;
    const docRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(docRef);
    if (!userDoc.exists()) return;
    const favorites = userDoc.data()?.favorites;
    setFavorites(favorites);
    setFavoriteList(Object.keys(favorites).map((id) => +id));
  };

  useEffect(() => {
    getRatings();
  }, []);

  useEffect(() => {
    getFavorites();
  }, []);

  useEffect(() => {
    if (onlyFavorites) getFavorites();
  }, [onlyFavorites]);

  const updateListLength = () => {
    setLength((prev) => prev + 6);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const offset = 100;
    const endOfPage = scrollTop + windowHeight + offset >= documentHeight;

    if (
      windowHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight ||
      endOfPage
    ) {
      return updateListLength();
    }

    return;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setFavoriteList(Object.keys(favorites).map((id) => Number(id)));
  }, [favorites]);

  const gameList = useMemo(() => {
    return games
      .filter((game) => {
        let [query, genre, platform] = [true, true, true];

        if (filterParams.query) {
          query = game.title
            .toLowerCase()
            .includes(filterParams.query.toLowerCase());
        }
        if (filterParams.genre) {
          genre = filterParams.genre.includes(game.genre);
        }
        if (filterParams.platform) {
          platform = game.platform === filterParams.platform;
          if (game.platform.split(", ").length > 1) {
            platform = game.platform
              .split(", ")
              .includes(filterParams.platform);
          }
        }

        return query && genre && platform;
      })
      .sort((a, b) => {
        const ratingA = ratings[a.id] || -1;
        const ratingB = ratings[b.id] || -1;

        if (filterParams.sortByRating) {
          if (ratingA === -1) return 1;
          if (ratingB === -1) return -1;
          if (ratingA === ratingB) {
            return a.title > b.title ? 1 : -1;
          }
          return filterParams.order === "asc"
            ? ratingA - ratingB
            : ratingB - ratingA;
        }

        return 1;
      })
      .filter((game) => {
        if (filterParams.onlyFavorites) {
          return favoriteList.includes(game.id);
        }
        return true;
      })
      .slice(0, length);
  }, [games, length, filterParams, ratings]);

  return gameList.length > 0 ? (
    <AnimatePresence>
      <motion.ul className="grid grid-cols-1 gap-8 w-full sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:px-0 ">
        {gameList.slice(0, length).map((game, index) => {
          return (
            <Card
              key={index}
              isOnFavorites={favoriteList.includes(game.id)}
              rating={ratings[game.id]}
              game={game}
              updateFuncs={{ getFavorites, getRatings }}
            ></Card>
          );
        })}
      </motion.ul>
    </AnimatePresence>
  ) : (
    games.length > 0 && gameList.length === 0 && (
      <div className="flex w-full justify-center items-center ">
        <span className="bg-gray-800 text-center text-3xl p-5 w-full">
          Nenhum resultado encontrado
        </span>
      </div>
    )
  );
};

export default GameList;
