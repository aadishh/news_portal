import { NewsSource } from '@/types/news'
import { Filter } from 'lucide-react'

interface FilterBarProps {
  sources: NewsSource[]
  selectedSource: string
  selectedCategory: string
  onSourceChange: (source: string) => void
  onCategoryChange: (category: string) => void
}

export function FilterBar({
  sources,
  selectedSource,
  selectedCategory,
  onSourceChange,
  onCategoryChange
}: FilterBarProps) {
  // Get all unique categories from all sources
  const allCategories = Array.from(
    new Set(sources.flatMap(source => source.categories))
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Filter News</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {(selectedSource || selectedCategory) && (
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedSource && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
              {sources.find(s => s.id === selectedSource)?.name}
              <button
                onClick={() => onSourceChange('')}
                className="ml-1 text-primary-400 hover:text-primary-600"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-1 text-primary-400 hover:text-primary-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}