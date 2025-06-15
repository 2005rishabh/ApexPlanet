import { searchMovies } from "@/lib/omdb"
import MainContent from "@/components/main-content" // New client component

export default async function HomePage() {
  // Fetch initial movies (e.g., "Batman" without a year filter)
  const { movies: initialMovies } = await searchMovies("Batman")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Movie Explorer</h1>
      <MainContent initialMovies={initialMovies} />
    </div>
  )
}
