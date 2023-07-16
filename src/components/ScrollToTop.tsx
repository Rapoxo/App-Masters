import { ArrowCircleUp } from "phosphor-react";
import React, { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  return (
    <div
      className={`${
        !showScroll && "hidden"
      } flex items-center justify-center fixed bottom-0 right-0 m-8  rounded-3xl bg-indigo-600 hover:bg-indigo-500 shadow-lg transition-all duration-200 z-50 cursor-pointer p-1`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowCircleUp size={48} />
    </div>
  );
};

export default ScrollToTop;
