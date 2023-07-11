import React, { useMemo } from "react";
import Card from "./Card";

type GameListProps = {
  games: Game[];
  length: number;
  filterParams: FilterParams;
};

const GameList = ({ games, length, filterParams }: GameListProps) => {
  const gameList = useMemo(() => {
    console.log(filterParams)
    return games.filter((game) => {
      let [query, genre, platform] = [true,true,true];


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
        if (game.platform.split(", ").length > 1) {platform = game.platform.split(", ").includes(filterParams.platform)};
      }

      return (query && genre && platform)

    }).slice(0, length);
  }, [games, length, filterParams]);

  return gameList.length > 0 ? (
    <ul className="grid grid-cols-1 gap-8 w-full sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:px-0 ">
      {gameList.slice(0, length).map((game, index) => {
        return <Card key={index} {...(game as Game)}></Card>;
      })}
    </ul>
  ) : (
    games.length > 0 && gameList.length === 0 && (
      <div className="flex w-full justify-center items-center">
        <span className="bg-gray-800 text-center text-3xl p-5 w-full">
          Nenhum resultado encontrado
        </span>
      </div>
    )
  );
};

export default GameList;
