import React, { useMemo, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Card from "./Card";

import { AuthContext } from "@/contexts/AuthContext";
import { firestore } from "@/services/firebaseClient";

type GameListProps = {
  games: Game[];
  length: number;
  filterParams: FilterParams;
};

const GameList = ({ games, length, filterParams }: GameListProps) => {
  const { user } = useContext(AuthContext);

  const [favoriteList, setFavoriteList] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const getRatings = async () => {
      if (!user) return;
      const docRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(docRef);
      if (!userDoc.exists()) return;
      const ratings = userDoc.data()?.ratings;
      setRatings(ratings);
    };
    getRatings();
  })

  useEffect(() => {
    const getFavorites = async () => {
      if (!user) return;
      const docRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(docRef);
      if (!userDoc.exists()) return;
      const favorites = userDoc.data()?.favorites;
      setFavorites(favorites);
      setFavoriteList(Object.keys(favorites).map((id) => +id));
    };
    getFavorites();
  });

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
      .slice(0, length);
  }, [games, length, filterParams]);

  return gameList.length > 0 ? (
    <ul className="grid grid-cols-1 gap-8 w-full sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:px-0 ">
      {gameList.slice(0, length).map((game, index) => {
        return (
          <Card
            key={index}
            isOnFavorites={favoriteList.includes(game.id)}
            rating={ratings[game.id]}
            game={game}
          ></Card>
        );
      })}
    </ul>
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
