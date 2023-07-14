import React, { useState } from "react";
import { useRouter } from "next/router";

import { Heart } from "phosphor-react";

type FavoriteProps = {
  value?: boolean;
  onClick: () => void;
  authenticated: boolean;
};

const Favorite = ({ value, onClick, authenticated }: FavoriteProps) => {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);

  const handleClick = () => {
    console.log(authenticated);
    if (!authenticated) return router.push("/auth");
    onClick();
  };

  return (
    <Heart
      className="cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
      weight={value || hovering ? "fill" : undefined}
      fillOpacity={hovering && !value ? 0.7 : undefined}
      fill={authenticated ? "red" : "gray"}
      color={authenticated ? "white" : "gray"}
      size={24}
    />
  );
};

export default Favorite;
