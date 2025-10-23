import { NewsArticle } from '@/types/news'
import { AlertTriangle } from 'lucide-react'

interface BreakingNewsTickerProps {
  articles: NewsArticle[]
}

export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
  if (articles.length === 0) return null

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center bg-red-700 px-3 py-1 rounded-md mr-4 flex-shrink-0">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-bold text-sm">BREAKING</span>
          </div>
          
          <div className="flex animate-scroll">
            {articles.map((article, index) => (
              <div key={article.id} className="flex items-center whitespace-nowrap">
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sm font-medium"
                >
                  {article.title}
                </a>
                {index < articles.length - 1 && (
                  <span className="mx-8 text-red-300">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  )
}