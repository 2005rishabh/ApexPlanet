"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { OmdbMovieSearchResult } from "@/lib/omdb"

interface MovieListProps {
  movies: OmdbMovieSearchResult[] // Now receives movies as a prop
}

export default function MovieList({ movies }: MovieListProps) {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.imdbID} href={`/movies/${movie.imdbID}`} className="block">
            <Card className="flex flex-col overflow-hidden h-full">
              <div className="relative w-full h-60">
                <Image
                  src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg"}
                  alt={movie.Title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-semibold truncate">{movie.Title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{movie.Year}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-muted-foreground flex-grow">
                <p className="line-clamp-3">{"No overview available for list view."}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
