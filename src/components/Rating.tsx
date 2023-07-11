import { Star } from "phosphor-react";
import React, { useState } from "react";

type RatingProps = {
  value?: number;
  onChange: (value: number) => void;
};

const Rating = ({ value, onChange }: RatingProps) => {
  const [hovering, setHovering] = useState<number>(-1);

  if (value && value > 4) throw new Error("Rating must be between 0 and 4");

  return (
    <div className="flex">
      {new Array(4).fill(null).map((el, i) => {
        return (
          <Star
            className="cursor-pointer"
            key={i}
            onMouseEnter={() => setHovering(i + 1)}
            onMouseLeave={() => setHovering(-1)}
            onClick={() => value && value !== i + 1 && onChange(i + 1)}
            weight={((value && value >= i + 1) || hovering >= i + 1 ) ? "fill" : undefined}
            fillOpacity={ (hovering >= i + 1 && (value && !(value >= i + 1))) ? 0.7 : undefined}
            fill="yellow"
          />
        );
      })}
    </div>
  );
};

export default Rating;
