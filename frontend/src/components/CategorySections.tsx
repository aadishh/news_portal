'use client'

import { useState, useEffect } from 'react'
import { NewsCard } from './NewsCard'
import { LoadingSpinner } from './LoadingSpinner'
import { newsService } from '@/services/newsService'
import { NewsArticle, Category } from '@/types/news'
import { ChevronRight } from 'lucide-react'

interface CategorySectionsProps {
  categories: Category[]
}

export function CategorySections({ categories }: CategorySectionsProps) {
  const [categoryNews, setCategoryNews] = useState<Record<string, NewsArticle[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const priorityCategories = ['politics', 'technology', 'business', 'sports', 'health', 'world']
  const displayCategories = categories.filter(cat => priorityCategories.includes(cat.id)).slice(0, 6)

  useEffect(() => {
    displayCategories.forEach(category => {
      loadCategoryNews(category.id)
    })
  }, [])

  const loadCategoryNews = async (categoryId: string) => {
    setLoading(prev => ({ ...prev, [categoryId]: true }))
    
    try {
      const newsData = await newsService.getNews({
        category: categoryId,
        per_page: 4
      })
      
      setCategoryNews(prev => ({
        ...prev,
        [categoryId]: newsData.articles
      }))
    } catch (error) {
      console.error(`Failed to load ${categoryId} news:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  return (
    <div className="space-y-12">
      {displayCategories.map((category) => (
        <section key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white capitalize">
                {category.name}
              </h2>
              <button className="flex items-center text-white hover:text-primary-100 transition-colors">
                <span className="mr-2">View All</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading[category.id] ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryNews[category.id]?.map((article) => (
                  <NewsCard key={article.id} article={article} compact />
                ))}
              </div>
            )}

            {!loading[category.id] && (!categoryNews[category.id] || categoryNews[category.id].length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No articles available in this category
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}