import Image from "next/image";
import React from "react";
import {
  CrosshairSimple,
  Globe,
  Sword,
  Trophy,
  NavigationArrow,
  PersonSimpleRun,
  FlagCheckered,
  Club,
  Target,
  UsersThree,
  Butterfly,
  HandFist,
  Desktop,
  Browsers,
} from "phosphor-react";

type CardProps = {
  thumbnail: string;
  title: string;
  genre: Genre;
  short_description: string;
  platform: Platform;
  game_url: string;
};

const icons = {
  genre: {
    Shooter: <CrosshairSimple weight="fill" />,
    MMOARPG: <Sword weight="fill" />,
    ARPG: <Sword weight="fill" />,
    Fighting: <HandFist weight="fill" />,
    "Action RPG": <Sword weight="fill" />,
    "Battle Royale": <Trophy weight="fill" />,
    MMORPG: <Globe weight="fill" />,
    MOBA: <NavigationArrow weight="fill" />,
    Sports: <PersonSimpleRun weight="fill" />,
    Racing: <FlagCheckered weight="fill" />,
    "Card Game": <Club weight="fill" />,
    Strategy: <Target weight="fill" />,
    MMO: <Globe weight="fill" />,
    Social: <UsersThree weight="fill" />,
    Fantasy: <Butterfly weight="fill" />,
  },
  platform: {
    "PC (Windows)": <Desktop weight="fill" />,
    Browser: <Browsers weight="fill" />,
  },
};

const Card = ({
  thumbnail,
  title,
  genre,
  short_description,
  platform,
  game_url,
}: CardProps) => {
  return (
    <li className="flex flex-col justify-between bg-slate-800  rounded-t-lg rounded-b-lg h-full">
      <div className="flex flex-col h-full">
        {/* Trocar por next/image */}
        <img
          className="w-full rounded-t-lg
        hover:contrast-75
        hover:brightness-110
        transition duration-100 ease-in
        "
          src={thumbnail}
          alt={title}
        />
        <div className="flex flex-col h-full px-4 pt-4">
          <div className="flex  justify-between">
            <h2 className="text-lg font-bold m-0">{title}</h2>
            <div className="flex">
              <span title={genre} className="flex text-gray-400">
                {icons.genre[genre]}
              </span>
              <span title={platform} className="flex text-gray-400 ml-2">
                {icons.platform[platform]}
              </span>
            </div>
          </div>
          <p className="text  mb-4">{short_description}</p>
        </div>
      </div>
      <a
        className="flex justify-center items-center p-4 bg-blue-700  no-underline rounded-b-lg transition duration-100 ease-in hover:bg-blue-500"
        href={game_url}
        target="_blank"
      >
        Jogar
      </a>
    </li>
  );
};

export default Card;
