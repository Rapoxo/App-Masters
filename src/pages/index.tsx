import Card from "@/components/Card";
import Filter from "@/components/Filter";

import { PT_Sans } from "next/font/google";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MagnifyingGlass, X } from "phosphor-react";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

type FilterParams = {
  query?: string;
  genre?: Genre | null;
  platforms?: Platform[];
};

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameList, setGameList] = useState<Game[]>([]);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    query: "",
    genre: null,
    platforms: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!loading) return;

    fetch("/api/games").then(async (response) => {
      const { error, data } = await response.json();
      if (error) return setError(error);
      setGames(data);
      setLoading(false);
    });
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputRef.current) return;
    const query = inputRef.current.value;
    if (!query) setFilterParams({ ...filterParams, query: "" });
    setFilterParams({ ...filterParams, query });
  }

  function updateFilterParams(data: FilterParams) {
    setFilterParams((prevFilterParams) => {
      const newFilterParams = { ...prevFilterParams, ...data };
      if (data.platforms) {
        // Remove duplicates from the platforms array
        newFilterParams.platforms = Array.from(new Set(data.platforms));
      }
      return newFilterParams;
    });
  }

  useEffect(() => {
    console.log(filterParams);
  }, [filterParams]);

  useEffect(() => {
    // Com certeza tem um erro aqui.
    if (!games.length) return;
    let filteredGames = games;

    if (filterParams.query) {
      filteredGames = filteredGames.filter((game) =>
        game.title.toLowerCase().includes(filterParams.query?.toLowerCase()!)
      );
    }

    if (filterParams.genre) {
      filteredGames = filteredGames.filter(
        (game) => game.genre === filterParams.genre
      );
    }

    if (filterParams.platforms?.length) {
      filteredGames = filteredGames.filter((game) =>
        filterParams.platforms?.every((platform) =>
          game.platform?.includes(platform)
        )
      );
    }

    setGameList(filteredGames);
  }, [filterParams.query, filterParams.genre, filterParams.platforms, games]);

  return (
    <div className={ptSans.className}>
      <Head>
        <title>App Masters</title>
      </Head>
      <div className="flex w-screen h-screen  ">
        <main className="w-full">
          {loading && !error ? (
            <span>Carregando...</span>
          ) : (
            !error && (
              <div className="flex flex-col justify-start xl:mx-48 xl:my-5 h-1/2">
                <div className="flex justify-between py-8 flex-col sm:flex-row ">
                  <div className="flex">
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
                          px-2
                          
                        "
                      >
                        <MagnifyingGlass />
                        <input
                          ref={inputRef}
                          className="w-full bg-slate-900 p-1 rounded-lg 
                            focus:ring-0
                            focus:outline-none"
                          type="text"
                          placeholder="Pesquisar"
                        />
                        <X
                          className="cursor-pointer"
                          onClick={() => {
                            inputRef.current!.value = "";
                            setFilterParams({
                              ...filterParams,
                              query: "",
                            });
                          }}
                        ></X>
                      </div>
                    </form>
                  </div>
                  <div className="flex">
                    <Filter
                      {...{
                        options: Array.from(
                          new Set(games.map((game) => game.genre))
                        ).map((genre, index) => genre as Genre),
                        multiple: false,
                        value: ["Action"],
                        name: "Gênero",
                      }}
                    />
                    <Filter
                      {...{
                        options: Array.from(
                          new Set(
                            games.flatMap((game) => game.platform.split(", "))
                          )
                        ).map((platform, index) => platform as Platform),
                        multiple: false,
                        value: ["Action"],
                        name: "Plataforma",
                      }}
                    />
                  </div>
                </div>
                {gameList.length > 1 ? (
                  <ul className="grid grid-cols-1 mx-4 gap-8 w-full sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:mx-0 ">
                    {gameList.map((game, index) => {
                      return <Card key={index} {...(game as any)}></Card>;
                    })}
                  </ul>
                ) : (
                  <div className="flex w-full justify-center items-center">
                    <span className="bg-gray-800 text-center text-3xl p-5 w-full">
                      Nenhum resultado encontrado
                    </span>
                  </div>
                )}
              </div>
            )
          )}
          {error && <span>{error}</span>}
        </main>
      </div>
    </div>
  );
}
