import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMovieDetails } from "@/lib/omdb" // Updated import

interface MovieDetailPageProps {
  params: {
    id: string // This will be the imdbID
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    notFound() // Renders Next.js's default 404 page
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Link>
        </Button>
      </div>
      <Card className="flex flex-col md:flex-row overflow-hidden shadow-lg">
        <div className="relative w-full md:w-1/3 h-96 md:h-auto flex-shrink-0">
          <Image
            src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg"}
            alt={movie.Title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </div>
        <div className="p-6 flex flex-col justify-center md:w-2/3">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-4xl font-bold mb-2">{movie.Title}</CardTitle>
            {movie.Plot !== "N/A" && <p className="text-lg italic text-muted-foreground mb-2">{movie.Plot}</p>}
            <CardDescription className="text-xl text-muted-foreground">
              {movie.Year}
              {movie.Runtime !== "N/A" && ` • ${movie.Runtime}`}
            </CardDescription>
            {movie.Genre !== "N/A" && (
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.Genre.split(", ").map((genre, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-gray-100 rounded-full dark:bg-gray-800">
                    {genre}
                  </span>
                ))}
              </div>
            )}
            {movie.Director !== "N/A" && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-semibold">Director:</span> {movie.Director}
              </p>
            )}
            {movie.Actors !== "N/A" && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Actors:</span> {movie.Actors}
              </p>
            )}
            {movie.imdbRating !== "N/A" && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">IMDb Rating:</span> {movie.imdbRating} ({movie.imdbVotes} votes)
              </p>
            )}
          </CardHeader>
          <CardContent className="p-0 text-lg text-foreground">
            {/* Full plot is already in CardHeader description for OMDb */}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
