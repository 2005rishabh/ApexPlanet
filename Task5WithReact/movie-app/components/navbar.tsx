"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle" // Import ThemeToggle

interface NavbarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedYear: string
  onYearChange: (year: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
}

export default function Navbar({
  searchTerm,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedType,
  onTypeChange,
}: NavbarProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (currentYear - i).toString())

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 max-w-5xl mx-auto px-4">
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search movies..."
          className="pl-10 pr-4 py-2 rounded-md w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex w-full md:w-1/2 gap-4">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Movie">Movie</SelectItem>
            <SelectItem value="Series">Series</SelectItem>
          </SelectContent>
        </Select>
        <ThemeToggle /> {/* Integrated ThemeToggle */}
      </div>
    </nav>
  )
}
