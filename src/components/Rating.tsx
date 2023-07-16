import React, { useState } from "react";
import { useRouter } from "next/router";

import { Star } from "phosphor-react";

type RatingProps = {
  value?: number;
  onChange: (value: number) => Promise<void>;
  authenticated: boolean;
  updateRatings: (value: number) => void;
};

const Rating = ({
  value,
  onChange,
  authenticated,
  updateRatings,
}: RatingProps) => {
  const router = useRouter();
  const [hovering, setHovering] = useState<number>(-1);
  value = value || -1;

  return (
    <div className="flex">
      {new Array(4).fill(null).map((el, i) => {
        const currentStar = i + 1;

        const handleClick = async () => {
          if (!authenticated) return router.push("auth");
          if (value && value !== currentStar) {
            await onChange(currentStar);
            updateRatings(currentStar);
          }
        };

        return (
          <Star
            className="cursor-pointer"
            key={i}
            onMouseEnter={() => setHovering(currentStar)}
            onMouseLeave={() => setHovering(-1)}
            onClick={handleClick}
            weight={
              (value && value >= currentStar) || hovering >= currentStar
                ? "fill"
                : undefined
            }
            fillOpacity={
              hovering >= currentStar && value && !(value >= currentStar)
                ? 0.7
                : undefined
            }
            fill={authenticated ? "yellow" : "gray"}
            color={authenticated ? "white" : "gray"}
            size={24}
          />
        );
      })}
    </div>
  );
};

export default Rating;
