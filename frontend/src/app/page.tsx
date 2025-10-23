'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { BreakingNewsTicker } from '@/components/BreakingNewsTicker'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { CategorySections } from '@/components/CategorySections'
import { SearchBar } from '@/components/SearchBar'
import { TrendingNews } from '@/components/TrendingNews'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { newsService } from '@/services/newsService'
import { NewsArticle, Category } from '@/types/news'

export default function Home() {
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([])
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([])
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [breakingData, featuredData, trendingData, categoriesData] = await Promise.all([
        newsService.getBreakingNews(),
        newsService.getFeaturedNews(),
        newsService.getTrendingNews(),
        newsService.getCategories()
      ])

      setBreakingNews(breakingData.articles)
      setFeaturedNews(featuredData.articles)
      setTrendingNews(trendingData.articles)
      setCategories(categoriesData.categories)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    try {
      const searchResults = await newsService.searchNews(query)
      // Handle search results - could navigate to search results page
      console.log('Search results:', searchResults)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <BreakingNewsTicker articles={breakingNews} />
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Search */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stay Informed
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest news from trusted sources around the world
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for news, topics, or sources..."
          />
        </div>

        {/* Featured Stories Carousel */}
        {featuredNews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Stories</h2>
            <FeaturedCarousel articles={featuredNews} />
          </section>
        )}

        {/* Trending News Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            {/* Category-based News Sections */}
            <CategorySections categories={categories} />
          </div>
          
          <div className="lg:col-span-1">
            {/* Trending News */}
            {trendingNews.length > 0 && (
              <TrendingNews articles={trendingNews} />
            )}
            
            {/* Newsletter Signup */}
            <div className="mt-8">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Most Read Articles Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Most Read Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingNews.slice(0, 6).map((article, index) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <span className="text-3xl font-bold text-primary-500">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{article.source}</span>
                      <span className="mx-2">•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}