import type IconType from "@/@types/IconType";
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

type GenreIcon = { [key in Genre]: IconType };

const Icons: GenreIcon = {
  Shooter: CrosshairSimple,
  MMOARPG: Sword,
  ARPG: Sword,
  Fighting: HandFist,
  "Action RPG": Sword,
  "Battle Royale": Trophy,
  MMORPG: Globe,
  MOBA: NavigationArrow,
  Sports: PersonSimpleRun,
  Racing: FlagCheckered,
  "Card Game": Club,
  Strategy: Target,
  MMO: Globe,
  Social: UsersThree,
  Fantasy: Butterfly,
};

type GenreIconProps = {
  genre: Genre;
};

const GenreIcon = ({ genre }: GenreIconProps) => {
  return (
    <span title={genre}>
      {React.createElement(Icons[genre], { weight: "fill" })}
    </span>
  );
};

export default GenreIcon;
