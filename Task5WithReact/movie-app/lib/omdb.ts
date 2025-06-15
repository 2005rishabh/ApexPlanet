export interface OmdbMovieSearchResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface OmdbSearchResponse {
  Search: OmdbMovieSearchResult[]
  totalResults: string
  Response: string
  Error?: string
}

export interface OmdbMovieDetails {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{ Source: string; Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
  Error?: string
}

const OMDB_API_BASE_URL = "https://www.omdbapi.com/"
const OMDB_API_KEY = process.env.OMDB_API_KEY || "131f32a1" // Using provided key directly, but recommend env var

export async function searchMovies(
  query: string,
  year?: string,
  type?: string,
  page = 1, // Added page parameter
): Promise<{ movies: OmdbMovieSearchResult[]; totalResults: number }> {
  if (!query) return { movies: [], totalResults: 0 }

  let url = `${OMDB_API_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
  if (year && year !== "All") {
    url += `&y=${encodeURIComponent(year)}`
  }
  if (type && type !== "All") {
    url += `&type=${encodeURIComponent(type.toLowerCase())}`
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }
    const data: OmdbSearchResponse = await response.json()

    if (data.Response === "True" && data.Search) {
      const filteredMovies = data.Search.filter((movie) => movie.Poster !== "N/A")
      return { movies: filteredMovies, totalResults: Number.parseInt(data.totalResults) }
    } else {
      console.warn(
        `OMDb API search for "${query}" (year: ${year || "any"}, type: ${type || "any"}, page: ${page}) returned: ${data.Error || "No results"}`,
      )
      return { movies: [], totalResults: 0 }
    }
  } catch (error) {
    console.error(
      `Error searching movies for "${query}" (year: ${year || "any"}, type: ${type || "any"}, page: ${page}):`,
      error,
    )
    return { movies: [], totalResults: 0 }
  }
}

export async function getMovieDetails(imdbID: string): Promise<OmdbMovieDetails | null> {
  if (!imdbID) return null

  try {
    const response = await fetch(
      `${OMDB_API_BASE_URL}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`,
    )
    if (!response.ok) {
      if (response.status === 404) {
        return null // Movie not found
      }
      throw new Error(`Failed to fetch movie details for ID ${imdbID}: ${response.statusText}`)
    }
    const data: OmdbMovieDetails = await response.json()

    if (data.Response === "True") {
      return data
    } else {
      console.warn(`OMDb API details for ID "${imdbID}" returned: ${data.Error || "No details found"}`)
      return null
    }
  } catch (error) {
    console.error(`Error fetching movie details for ID ${imdbID}:`, error)
    return null
  }
}
