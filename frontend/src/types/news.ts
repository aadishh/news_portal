export interface NewsArticle {
  id: string
  title: string
  subtitle?: string
  url: string
  summary?: string
  content?: string
  author?: string
  published_date?: string
  source: string
  category?: string
  tags: string[]
  image_url?: string
  video_url?: string
  read_time?: number
  views: number
  is_breaking: boolean
  is_featured: boolean
  is_trending: boolean
  related_articles: string[]
}

export interface NewsResponse {
  articles: NewsArticle[]
  total: number
  source: string
  page: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

export interface NewsSource {
  id: string
  name: string
  categories: string[]
}

export interface SourcesResponse {
  sources: NewsSource[]
}

export interface NewsFilters {
  source?: string
  category?: string
  page?: number
  per_page?: number
}export in
terface User {
  id: string
  email: string
  name: string
  preferences: UserPreferences
  bookmarks: string[]
  subscription_active: boolean
  created_at: string
  last_login?: string
}

export interface UserRegistration {
  email: string
  name: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserPreferences {
  categories: string[]
  sources: string[]
  location?: string
  dark_mode: boolean
  notifications: boolean
}

export interface Comment {
  id: string
  article_id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
  approved: boolean
  replies: Comment[]
}

export interface Category {
  id: string
  name: string
  count: number
}

export interface AnalyticsData {
  total_articles: number
  total_views: number
  top_categories: Record<string, number>
  trending_articles: NewsArticle[]
  daily_views: Record<string, number>
}