export interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview: string
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string | null
}

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500" // Common image size

export async function fetchPopularMovies(): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("TMDB_API_KEY is not set. Please set it as an environment variable.")
    return []
  }

  try {
    const response = await fetch(`${TMDB_API_BASE_URL}/movie/popular?api_key=${apiKey}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch popular movies: ${response.statusText}`)
    }
    const data = await response.json()
    return data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      overview: movie.overview,
    }))
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return []
  }
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails | null> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.error("TMDB_API_KEY is not set. Please set it as an environment variable.")
    return null
  }

  try {
    const response = await fetch(`${TMDB_API_BASE_URL}/movie/${id}?api_key=${apiKey}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null // Movie not found
      }
      throw new Error(`Failed to fetch movie details for ID ${id}: ${response.statusText}`)
    }
    const movie = await response.json()
    return {
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      overview: movie.overview,
      genres: movie.genres,
      runtime: movie.runtime,
      tagline: movie.tagline,
    }
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error)
    return null
  }
}

export function getTmdbImageUrl(path: string | null): string {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : "/placeholder.svg"
}
