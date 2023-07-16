import React, { useMemo } from "react";
import Carousel from "./Carousel";

const Highlights = ({ games, length }: { games: Game[]; length: number }) => {
  const gameList = useMemo(() => {
    const randomGames = games.slice().sort(() => Math.random() - Math.random());
    return randomGames.slice(0, length);
  }, [games, length]);

  return games.length > 0 ? (
    <div>
      <h1 className="text-3xl font-bold my-4 ">Destaques do dia</h1>
      <div className="mb-5">
        <Carousel games={gameList} />
      </div>
    </div>
  ) : null;
};

export default Highlights;
