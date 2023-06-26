type Genre =
  | "Shooter"
  | "MMOARPG"
  | "ARPG"
  | "Fighting"
  | "Action RPG"
  | "Battle Royale"
  | "MMORPG"
  | "MOBA"
  | "Sports"
  | "Racing"
  | "Card Game"
  | "Strategy"
  | "MMO"
  | "Social"
  | "Fantasy";

type Game = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: Genre;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
};

type Platform = "PC (Windows)" | "Web Browser";

type FilterParams = {
  query?: string;
  genre?: Genre | null;
  platforms?: Platform[];
};
