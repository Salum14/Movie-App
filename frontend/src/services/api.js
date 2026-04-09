const BACKEND_URL = "http://localhost:5001";

export const getPopularMovies = async () => {
  const response = await fetch(`${BACKEND_URL}/api/popular`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};