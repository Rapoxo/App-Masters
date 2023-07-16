import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MagnifyingGlass,
  SortAscending,
  SortDescending,
  X,
} from "phosphor-react";

import Filter from "@/components/Filter";
import GameList from "@/components/GameList";
import Highlights from "@/components/Highlights";

import Head from "next/head";
import Loader from "@/components/Loader";
import { AuthContext } from "@/contexts/AuthContext";
import { FavoriteContext } from "@/contexts/FavoriteContext";

const Home = () => {
  const { user, loading: loadingAuth } = useContext(AuthContext);
  const { onlyFavorites, setOnlyFavorites } = useContext(FavoriteContext);
  const [isLogged, setIsLogged] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [filterParams, setFilterParams] = useState<FilterParams>({
    query: "",
    genre: null,
    platform: null,
    onlyFavorites: onlyFavorites,
    sortByRating: true,
    order: order,
  });

  const [value, setValue] = useState<string>("");
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

  useEffect(() => {
    if (!loading) fetchData();
  }, []);

  useEffect(() => {
    if (loadingAuth) return;
    if (user) setIsLogged(true);
  }, [user]);

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
    setFilterParams({ ...filterParams, onlyFavorites });
  }, [onlyFavorites]);

  return (
    <div>
      <Head>
        <title>App Masters</title>
      </Head>

      <div className="flex max-w-screen w-full h-[90vh] ">
        <main className="w-full">
          <div className="flex flex-col  px-4 justify-start xl:mx-48 xl:my-5 h-1/2">
            {loading && !error && games.length < 1 ? (
              <Loader />
            ) : error ? (
              <div className="flex flex-col gap-3 justify-center h-full">
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
                  {onlyFavorites ? (
                    <>Esses são seus jogos favoritos:</>
                  ) : (
                    <>
                      Encontre seus jogos{" "}
                      <button
                        className="text-indigo-400 hover:underline"
                        onClick={() => {
                          setOnlyFavorites((prev) => !prev);
                        }}
                      >
                        favoritos
                      </button>{" "}
                      aqui:{" "}
                    </>
                  )}
                </h2>

                {/* Search & Filters */}
                <div className="mb-4">
                  <div className="flex flex-col gap-2 justify-between pb-4 sm:flex-row">
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
                    <div className="flex justify-between gap-4 items-center">
                      <span className="sm:hidden">Filtrar por: </span>
                      <div className="grid grid-cols-2 gap-2">
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
                                games.flatMap((game) =>
                                  game.platform.split(", ")
                                )
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
                  <div className="flex justify-between">
                    <div>
                      <button
                        className="
                        flex
                        gap-2
                        items-center
                      bg-indigo-700
                      hover:bg-indigo-600
                      px-4
                      py-3
                      rounded-lg
                      text-sm
                      text-white
                      font-bold
                      transition-all
                      duration-200
                      ease-in-out
                      disabled:bg-gray-600
                      disabled:hover:bg-gray-500
                      "
                        onClick={() => {
                          updateFilterParams({
                            ...filterParams,
                            sortByRating: !filterParams.sortByRating,
                          });
                        }}
                      >
                        <input
                          name="rating"
                          className="accent-indigo-900"
                          checked={filterParams.sortByRating}
                          type="checkbox"
                          onChange={() => {
                            updateFilterParams({
                              ...filterParams,
                              sortByRating: !filterParams.sortByRating,
                            });
                          }}
                        />
                        Avaliação
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setOrder((prev) => {
                          const newOrder = prev === "asc" ? "desc" : "asc";
                          updateFilterParams({
                            ...filterParams,
                            order: newOrder,
                          });
                          return newOrder;
                        });
                      }}
                      disabled={!isLogged || loadingAuth}
                      title={
                        !isLogged || loadingAuth
                          ? "Faça login para ordenar por avaliação"
                          : ""
                      }
                      className="flex gap-1 justify-between font-bold items-center min-w-[140px] px-4 py-3 bg-gradient-to-t bg-indigo-700 hover:bg-indigo-600 disabled:bg-gray-600 disabled:hover:bg-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 ease-in-out"
                    >
                      {order === "asc" ? "Crescente" : "Decrescente"}
                      {order === "asc" ? <SortAscending /> : <SortDescending />}
                    </button>
                  </div>
                </div>
                {/* 
                                    <input
                      checked={filterParams.sortByRating}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {
                        updateFilterParams({
                          ...filterParams,
                          sortByRating: !filterParams.sortByRating,
                        });
                      }}
                      className="ml-2"
                      type="checkbox"
                    />
                */}
                <GameList games={games} filterParams={filterParams} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
