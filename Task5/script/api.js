// api.js
const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = '131f32a1';

/**
 * Search movies by title with pagination
 * @param {string} query - The movie title to search for
 * @param {number} page - Page number
 * @returns {Promise<Array>} - An array of movie objects
 */
export async function searchMovies(query, page = 1) {
  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
    const data = await res.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

/**
 * Get detailed information about a movie
 * @param {string} imdbID - The IMDb ID of the movie
 * @returns {Promise<Object|null>}
 */
export async function getMovieDetails(imdbID) {
  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
    const data = await res.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}
