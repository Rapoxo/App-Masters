import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { CloudLightning, MagnifyingGlass, X } from "phosphor-react";

import Filter from "@/components/Filter";
import GameList from "@/components/GameList";
import Highlights from "@/components/Highlights";

import Head from "next/head";
import { PT_Sans } from "next/font/google";
import Link from "next/link";
import Loader from "@/components/Loader";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

const Home = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterParams, setFilterParams] = useState<FilterParams>({
    query: "",
    genre: null,
    platform: null,
    onlyFavorites: false,
    sortBy: "rating",
    order: "asc",
  });

  const [value, setValue] = useState<string>("");
  const [listLength, setListLength] = useState(12);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetch("/api/games").then(async (response) => {
      const { error, data } = await response.json();
      if (error) return setError(error);
      setGames(data);
      setLoading(false);
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const query = inputRef.current.value;
    if (!query) setFilterParams({ ...filterParams, query: "" });
    setFilterParams({ ...filterParams, query });
  };

  const updateFilterParams = (data: FilterParams) => {
    setFilterParams((prevFilterParams) => {
      const newFilterParams = { ...prevFilterParams, ...data };
      return newFilterParams;
    });
  };
  const changeHandler = useCallback(updateFilterParams, []);

  const updateListLength = () => {
    setListLength((prev) => prev + 6);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const offset = 100;
    const endOfPage = scrollTop + windowHeight + offset >= documentHeight;

    if (
      windowHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight ||
      endOfPage
    ) {
      return updateListLength();
    }

    return;
  };

  useEffect(() => {
    if (!loading) fetchData();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debouncer para pesquisa de titulos
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterParams({ ...filterParams, query: value });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    console.log(filterParams);
  }, [filterParams]);

  return (
    <div className={`${ptSans.className}`}>
      <Head>
        <title>App Masters</title>
      </Head>

      <div className="flex max-w-screen w-full h-[90vh] ">
        <main className="w-full">
          <div className="flex flex-col  px-4 justify-start xl:mx-48 xl:my-5 h-1/2">
            {loading && !error && games.length < 1 ? (
              <Loader />
            ) : error ? (
              <div className="flex flex-col gap-3 justify-center items-center h-full ">
                <h1>{error}</h1>
                <button
                  onClick={() => fetchData()}
                  className="bg-indigo-700  hover:bg-indigo-600 p-2 rounded-md"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                <Highlights length={6} games={games} />

                <h2 className="text-2xl my-4">
                  Encontre seus jogos{" "}
                  <Link
                    className="text-indigo-400 hover:underline"
                    href="/favorites"
                  >
                    favoritos
                  </Link>{" "}
                  aqui:
                </h2>

                {/* Search & Filters */}
                <div className="flex flex-col gap-2 justify-between pb-4 sm:flex-row ">
                  <div className="flex w-full sm:w-auto  ">
                    <form className=" w-full" onSubmit={handleSubmit}>
                      <div
                        className="
                          flex
                          justify-center
                          w-full
                          bg-slate-900
                          rounded-lg
                          items-center
                          text-white
                          px-3
                          relative
                        "
                      >
                        <MagnifyingGlass />
                        <input
                          ref={inputRef}
                          className="w-full bg-slate-900 p-2  rounded-lg 
                            focus:ring-0
                            focus:outline-none"
                          type="text"
                          placeholder="Pesquisar"
                          onChange={(e) => setValue(e.target.value)}
                        />
                        {inputRef.current?.value && (
                          <X
                            className="cursor-pointer absolute right-0 mr-2"
                            onClick={() => {
                              inputRef.current!.value = "";
                              setFilterParams({
                                ...filterParams,
                                query: "",
                              });
                            }}
                          ></X>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="flex justify-between gap-4 items-center   ">
                    <span className="sm:hidden">Filtrar por: </span>
                    <div className="grid grid-cols-2">
                      <Filter
                        {...{
                          options: Array.from(
                            new Set(games.map((game) => game.genre))
                          ),
                          multiple: false,
                          onChange: changeHandler,
                          name: "genre",
                          label: "Gênero",
                        }}
                      />
                      <Filter
                        {...{
                          options: Array.from(
                            new Set(
                              games.flatMap((game) => game.platform.split(", "))
                            )
                          ),
                          multiple: false,
                          onChange: changeHandler,
                          name: "platform",
                          label: "Plataforma",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* GameList */}
                <GameList
                  games={games}
                  length={listLength}
                  filterParams={filterParams}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
