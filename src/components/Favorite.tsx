import React, { useState } from "react";
import { Heart } from "phosphor-react";

const Favorite = ({ value }: { value: boolean }) => {
  const [hovering, setHovering] = useState(false);

  return (
    <Heart
    className="cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      weight={value || hovering ? "fill" : undefined}
      fillOpacity={hovering && !value ? 0.7 : undefined}
      fill="red"
    />
  );
};

export default Favorite;
