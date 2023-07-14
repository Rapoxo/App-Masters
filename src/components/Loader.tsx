import React from "react";
import { PacmanLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full ">
      <PacmanLoader color="#4f46e5" />
    </div>
  );
};

export default Loader;
