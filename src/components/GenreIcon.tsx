import {
  Butterfly,
  Club,
  CrosshairSimple,
  FlagCheckered,
  Globe,
  HandFist,
  NavigationArrow,
  PersonSimpleRun,
  Sword,
  Target,
  Trophy,
  UsersThree,
} from "phosphor-react";

import React from "react";

const icons = {
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
};

type GenreIconProps = {
  genre: Genre;
};

const GenreIcon = ({ genre }: GenreIconProps) => {
  return <span title={genre}>{icons[genre]}</span>
};

export default GenreIcon;
