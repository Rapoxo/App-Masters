import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

import PlatformIcon from "./PlatformIcon";
import GenreIcon from "./GenreIcon";
import Rating from "./Rating";
import Favorite from "./Favorite";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/services/firebaseClient";

type CardProps = {
  game: Game;
  isOnFavorites?: boolean;
  rating?: number; // 1 a 4
};

const Card = ({ game, isOnFavorites, rating }: CardProps) => {
  const {
    id,
    title,
    thumbnail,
    short_description,
    game_url,
    genre,
    platform,
    publisher,
    developer,
    release_date,
    freetogame_profile_url,
  } = game;

  const { user } = useContext(AuthContext);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (liRef.current && !liRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [liRef]);

  const ratingHandler = async (id: number, rating: number) => {
    if (!user) return;
    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);
    updateDoc(userRef, {
      ratings: {
        ...userDoc.data()?.ratings,
        [id]: rating,
      },
    });
  };

  return (
    <li
      ref={liRef}
      id={id.toString()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setOpen(!open)}
      className="flex flex-col justify-between   rounded-t-lg rounded-b-lg h-full "
    >
      <div className="flex flex-col relative h-full">
        <img
          className={`w-full rounded-t-lg relative
          transition duration-100 ease-in 
          `}
          src={thumbnail}
          alt={title}
        />

        <div className="backdrop backdrop-blur-md absolute bottom-0 z-10 bg-blue-950/80 w-full flex flex-col min-h-1/2 px-4 py-2 ">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold m-0">
              {title} •{" "}
              <span className="text-sm text-indigo-300">{developer}</span>
            </h3>
            <div className="flex gap-1 text-indigo-20">
              <GenreIcon genre={genre} />
              <div className="flex">
                {platform.split(", ").map((plat) => {
                  return (
                    <PlatformIcon
                      platform={plat as Platform}
                      key={`${id}-${plat}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className={`${!open && !hover && "hidden"} text mb-1`}>
            <p>{short_description}</p>
            <span>Lançamento: {release_date}</span>
          </div>
          <div className="flex gap-2 items-center my-1">
            <Rating
              onChange={(value) => ratingHandler(id, value)}
              authenticated={!!user}
              value={rating}
            />
            <Favorite value={isOnFavorites} id={id} />
          </div>
        </div>
      </div>
      <a
        className="flex justify-center font-bold items-center p-4 bg-gradient-to-t bg-indigo-700 hover:bg-indigo-600 text-xl no-underline rounded-b-lg transition-all duration-200 ease-in-out "
        href={game_url}
        target="_blank"
      >
        Jogar
      </a>
    </li>
  );
};

export default Card;
