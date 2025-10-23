import { NewsArticle } from '@/types/news'
import { TrendingUp, Eye, Clock } from 'lucide-react'

interface TrendingNewsProps {
  articles: NewsArticle[]
}

export function TrendingNews({ articles }: TrendingNewsProps) {
  if (articles.length === 0) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
        <div className="flex items-center text-white">
          <TrendingUp className="h-5 w-5 mr-2" />
          <h3 className="font-bold">Trending Now</h3>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {articles.slice(0, 8).map((article, index) => (
          <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </span>
              
              <div className="flex-1 min-w-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-primary-600 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                    {article.title}
                  </h4>
                </a>
                
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {article.views}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(article.published_date)}
                  </span>
                </div>
                
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded">
                    {article.source}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <button className="w-full text-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
          View All Trending Stories
        </button>
      </div>
    </div>
  )
}