"use client"

import { useState, useEffect, useRef, useCallback } from "react" // Added useRef, useCallback
import { type OmdbMovieSearchResult, searchMovies } from "@/lib/omdb"
import Navbar from "@/components/navbar"
import MovieList from "@/components/movie-list"
import { Loader2 } from "lucide-react" // For loading spinner

interface MainContentProps {
  initialMovies: OmdbMovieSearchResult[]
}

export default function MainContent({ initialMovies }: MainContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [movies, setMovies] = useState<OmdbMovieSearchResult[]>(initialMovies)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const observerTarget = useRef<HTMLDivElement>(null)
  const initialLoadDone = useRef(false) // To prevent initial useEffect from triggering observer logic

  const fetchMovies = useCallback(
    async (currentPage: number, append = false) => {
      setLoading(true)
      const { movies: fetchedMovies, totalResults: fetchedTotalResults } = await searchMovies(
        searchTerm || "Batman", // Default to "Batman" if search term is empty
        selectedYear,
        selectedType,
        currentPage,
      )

      if (append) {
        setMovies((prevMovies) => [...prevMovies, ...fetchedMovies])
      } else {
        setMovies(fetchedMovies)
      }
      setTotalResults(fetchedTotalResults)
      setHasMore(currentPage * 10 < fetchedTotalResults) // OMDb returns 10 results per page
      setLoading(false)
    },
    [searchTerm, selectedYear, selectedType],
  )

  // Effect for initial search or when filters/search term change
  useEffect(() => {
    setPage(1) // Reset page when search term or filters change
    setHasMore(true) // Assume there's more until proven otherwise
    initialLoadDone.current = false // Reset initial load flag
    fetchMovies(1, false) // Fetch first page, don't append
  }, [searchTerm, selectedYear, selectedType, fetchMovies])

  // Effect for IntersectionObserver (lazy loading)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && initialLoadDone.current) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading])

  // Effect to fetch next page when `page` state changes (triggered by observer)
  useEffect(() => {
    if (page > 1) {
      fetchMovies(page, true) // Fetch next page, append results
    } else if (page === 1 && !initialLoadDone.current) {
      // Mark initial load as done after the first fetch completes
      initialLoadDone.current = true
    }
  }, [page, fetchMovies])

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />
      <div className="container mx-auto px-4 py-8">
        <MovieList movies={movies} />

        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && hasMore && movies.length > 0 && (
          <div ref={observerTarget} className="flex justify-center py-4">
            {/* This div is the target for the IntersectionObserver */}
            <span className="text-muted-foreground">Scroll down to load more...</span>
          </div>
        )}

        {!loading && !hasMore && movies.length > 0 && (
          <div className="flex justify-center py-4">
            <span className="text-muted-foreground">You've reached the end of the results.</span>
          </div>
        )}

        {!loading && movies.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">No movies found matching your search.</p>
        )}
      </div>
    </>
  )
}
