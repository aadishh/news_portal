'use client'

import { useState } from 'react'
import { NewsArticle } from '@/types/news'
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react'

interface FeaturedCarouselProps {
  articles: NewsArticle[]
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (articles.length === 0) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-96 md:h-[500px]">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Image */}
              <div className="relative">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold opacity-20">NEWS</span>
                  </div>
                )}
                
                {article.is_breaking && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    BREAKING
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-full">
                    {article.source}
                  </span>
                  {article.category && (
                    <span className="ml-2 text-sm text-gray-500 capitalize">
                      {article.category}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-clamp-3">
                  {article.title}
                </h2>

                {article.subtitle && (
                  <p className="text-lg text-gray-600 mb-4">
                    {article.subtitle}
                  </p>
                )}

                {article.summary && (
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {article.summary}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(article.published_date)}
                    {article.read_time && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{article.read_time} min read</span>
                      </>
                    )}
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Read Full Story
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}