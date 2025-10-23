import { NewsArticle } from '@/types/news'
import { ExternalLink, Clock, Eye, Bookmark, Share2, Tag } from 'lucide-react'

interface NewsCardProps {
  article: NewsArticle
  compact?: boolean
  showBookmark?: boolean
  onBookmark?: (articleId: string) => void
}

export function NewsCard({ article, compact = false, showBookmark = false, onBookmark }: NewsCardProps) {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.url)
    }
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="flex">
          {article.image_url && (
            <div className="w-24 h-24 flex-shrink-0 bg-gray-200">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
          
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded">
                {article.source}
              </span>
              {article.is_breaking && (
                <span className="inline-block px-2 py-1 text-xs font-bold text-red-600 bg-red-50 rounded">
                  BREAKING
                </span>
              )}
            </div>
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>{formatDate(article.published_date)}</span>
                {article.views > 0 && (
                  <>
                    <Eye className="h-3 w-3" />
                    <span>{article.views}</span>
                  </>
                )}
              </div>
              
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {article.image_url && (
        <div className="h-48 bg-gray-200 overflow-hidden relative">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop'
            }}
          />
          
          {article.is_breaking && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              BREAKING
            </div>
          )}
          
          {article.is_featured && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              FEATURED
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
              {article.source}
            </span>
            {article.category && (
              <span className="text-xs text-gray-500 capitalize">
                {article.category}
              </span>
            )}
          </div>
          
          {showBookmark && (
            <button
              onClick={() => onBookmark?.(article.id)}
              className="text-gray-400 hover:text-primary-500 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3">
          {article.title}
        </h3>
        
        {article.subtitle && (
          <p className="text-gray-700 text-sm mb-2 font-medium">
            {article.subtitle}
          </p>
        )}
        
        {article.summary && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}
        
        {article.tags.length > 0 && (
          <div className="flex items-center mb-4">
            <Tag className="h-3 w-3 text-gray-400 mr-1" />
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm space-x-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(article.published_date)}
            </div>
            
            {article.read_time && (
              <span>{article.read_time} min read</span>
            )}
            
            {article.views > 0 && (
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.views}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-primary-500 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              Read more
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}