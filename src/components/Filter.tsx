import React from "react";
import { PT_Sans } from "next/font/google";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

const Filter = ({
  multiple,
  options,
  value,
  name,
}: {
  multiple: boolean;
  options: string[];
  value: string[];
  name: string;
}) => {
  return (
    <div className="mr-4">
      <span className="mr-2">{name}:</span>
      <select
        className="rounded-md bg-slate-800 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        multiple={multiple}
        value={value}
      >
        {options.map((option) => (
          <option
            className={`bg-gray-800 hover:bg-gray-700 px-5 ${ptSans.className}`}
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
