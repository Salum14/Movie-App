import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();
export const useMovieContext = () => useContext(MovieContext);

const BACKEND_URL = "http://localhost:5001";

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // 📥 LOAD from MongoDB
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/favorites`);
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.log("Error loading favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  // ❤️ ADD favorite (MongoDB)
  const addToFavorites = async (movie) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });

      const data = await res.json();

      setFavorites((prev) => {
        const exists = prev.some((m) => m.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    } catch (err) {
      console.log("Error adding favorite:", err);
    }
  };

  // ❌ REMOVE favorite (MongoDB)
  const removeFromFavorites = async (movieID) => {
    try {
      await fetch(`${BACKEND_URL}/api/favorites/${movieID}`, {
        method: "DELETE",
      });

      setFavorites((prev) =>
        prev.filter((movie) => movie.id !== movieID)
      );
    } catch (err) {
      console.log("Error removing favorite:", err);
    }
  };

  // ✔️ check favorite
  const isFavorite = (movieID) => {
    return favorites.some((movie) => movie.id === movieID);
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};