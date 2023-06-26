import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MagnifyingGlass, X } from "phosphor-react";

import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Filter from "@/components/Filter";
import Head from "next/head";
import Header from "@/components/Header";
import { PT_Sans } from "next/font/google";
import { PacmanLoader } from "react-spinners";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin-ext"],
});

const Home = () => {

  const [games, setGames] = useState<Game[]>([]);
  const [gameList, setGameList] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterParams, setFilterParams] = useState<FilterParams>({
    query: "",
    genre: null,
    platforms: [],
  });

  const [value, setValue] = useState<string>("");
  const [listLength, setListLength] = useState(12);
  const inputRef = useRef<HTMLInputElement>(null);

  const highlightedGames = useMemo(() => {
    return new Array(5).fill(null).map((el) => {
      return games[Math.floor(Math.random() * games.length)];
    });
  }, [games]);


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
      if (data.platforms) {
        // Remove duplicates from the platforms array
        newFilterParams.platforms = Array.from(new Set(data.platforms));
      }
      return newFilterParams;
    });
  };
  const changeHandler = useCallback(updateFilterParams, []);

  const handleNewList = () => {
    setListLength((prev) => prev + 6);
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const hasOnFinalPage = scrollTop + windowHeight >= documentHeight;

    if (
      windowHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight ||
      hasOnFinalPage
    ) {
      return handleNewList();
    }

    return;
  };

  useEffect(() => {
    if (!games.length) return;
    let filteredGames = games;

    if (filterParams.query) {
      filteredGames = filteredGames.filter((game) => {
        return game.title
          .toLowerCase()
          .includes(filterParams.query?.toLowerCase() as string);
      });
    }

    if (filterParams.genre) {
      filteredGames = filteredGames.filter((game) =>
        filterParams.genre?.includes(game.genre)
      );
    }

    if (filterParams.platforms?.length) {
      filteredGames = filteredGames.filter((game) => {
        if (filterParams.platforms?.length === 1)
          return game.platform === filterParams.platforms[0];

        return filterParams.platforms?.every((platform) =>
          game.platform.includes(platform)
        );
      });
    }

    setGameList(filteredGames);
  }, [filterParams, games]);

  useEffect(() => {
    if(!loading) fetchData();

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


  return (
    <div className={`${ptSans.className}`}>
      <Head>
        <title>App Masters</title>
      </Head>

      <Header/>

      <div className="flex max-w-screen w-full h-screen  ">
        <main className="w-full">
          <div className="flex flex-col  px-4 justify-start xl:mx-48 xl:my-5 h-1/2">
            {loading && !error && games.length < 1 ? (
              <div className="flex justify-center items-center h-full ">
                <PacmanLoader color="#4f46e5" />
              </div>
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
                {games.length > 0 && (
                  <>
                    <h1 className="text-3xl font-bold my-4 ">
                      Destaques do dia:
                    </h1>
                    <div className="mb-5">
                      <Carousel games={highlightedGames} />
                    </div>
                  </>
                )}

                <h2 className="text-2xl my-4">
                  Encontre seus jogos{" "}
                  <span className="text-indigo-400">favoritos</span> aqui:
                </h2>

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
                          px-2
                        "
                      >
                        <MagnifyingGlass />
                        <input
                          ref={inputRef}
                          className="w-full bg-slate-900 p-1 py-2  rounded-lg 
                            focus:ring-0
                            focus:outline-none"
                          type="text"
                          placeholder="Pesquisar"
                          onChange={(e) => setValue(e.target.value)}
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
                  <div className="flex justify-between gap-4 items-center   ">
                    <span className="sm:hidden">Filtrar por: </span>
                    <div className="grid grid-cols-2">
                      <Filter
                        {...{
                          options: Array.from(
                            new Set(games.map((game) => game.genre))
                          ).map((genre, index) => genre as Genre),
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
                          ).map((platform, index) => platform as Platform),
                          multiple: true,
                          label: "Plataforma",
                          name: "platforms",
                          onChange: changeHandler,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {gameList?.length > 0 ? (
                  <ul className="grid grid-cols-1  gap-8 w-full sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:px-0 ">
                    {gameList.slice(0, listLength).map((game, index) => {
                      return <Card key={index} {...(game as any)}></Card>;
                    })}
                  </ul>
                ) : (
                  games.length > 0 &&
                  gameList?.length === 0 && (
                    <div className="flex w-full justify-center items-center">
                      <span className="bg-gray-800 text-center text-3xl p-5 w-full">
                        Nenhum resultado encontrado
                      </span>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
