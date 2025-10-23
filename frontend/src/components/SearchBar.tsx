'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Search news...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const clearSearch = () => {
    setQuery('')
    setIsFocused(false)
  }

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-white rounded-full shadow-lg border-2 transition-all duration-200 ${
          isFocused ? 'border-primary-500 shadow-xl' : 'border-gray-200'
        }`}>
          <Search className="h-5 w-5 text-gray-400 ml-4" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 px-4 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-400"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-full mr-1 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Suggestions (could be enhanced with real suggestions) */}
      {isFocused && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Breaking News', 'Technology', 'Politics', 'Sports', 'Business'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion)
                    onSearch(suggestion)
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}