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

const icons: {
  genre: { [key in Genre]: React.FC };
  platform: { [key in Platform]: React.FC };
} = {
  genre: {
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
  },
  platform: {
    "PC (Windows)": Desktop,
    Browser: Browsers,
  },
};

import React from "react";

const Icon = (name: string) => {

  return <div></div>;
};

export default Icon;
