import React, { useState, useEffect, useRef } from "react";
import { CaretDown } from "phosphor-react";

type FilterProps = {
  multiple: boolean;
  options: string[];
  label: string;
  name: string;
  onChange: (data: FilterParams) => void;
};

const Filter = ({ multiple, options, label, name, onChange }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

 /*  useEffect(() => {
    onChange({ [name]: selected });
  }, [selected, onChange, name]); */

  return (
    <div className="mr-4" ref={filterRef}>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex relative justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-slate-500 items-center"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={() => setIsOpen(!isOpen)}
          >
            {
              /* !multiple && selected.length > 0 ? selected[0] : label */
              label
            }
            <span
              className={`
              transition 
              duration-200
              ease-in-out
            ${isOpen ? "-scale-y-100" : ""}`}
            >
              <span>
                <CaretDown className="ml-2" />
              </span>
            </span>
          </button>

          <div
            className={`${
              isOpen ? "block" : "hidden"
            } select-none z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-900 ring-1 ring-black ring-opacity-5`}
          >
            <div
              className={`py-1 ${
                multiple ? "max-h-60 overflow-y-scroll" : ""
              } text-base rounded-md bg-slate-900 shadow-xs`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((option, index) => (
                <label key={index}>
                  <div
                    className={`${
                      multiple ? "flex justify-between" : ""
                    } cursor-pointer px-4 py-2 text-sm text-white hover:bg-slate-800 hover:text-white`}
                    role="menuitem"
                    onClick={() => {
                      if (multiple) return;
                      setSelected([option]);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                    {multiple && (
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selected.includes(option)}
                        onChange={() => {
                          if (selected.includes(option)) {
                            setSelected(
                              selected.filter((item) => item !== option)
                            );
                          } else {
                            setSelected([...selected, option]);
                          }
                        }}
                      />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
