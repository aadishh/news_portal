import axios from 'axios'
import { NewsResponse, SourcesResponse, NewsFilters } from '@/types/news'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const newsService = {
  async getNews(filters: NewsFilters = {}): Promise<NewsResponse> {
    const params = new URLSearchParams()
    
    if (filters.source) params.append('source', filters.source)
    if (filters.category) params.append('category', filters.category)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await api.get(`/news?${params.toString()}`)
    return response.data
  },

  async getBreakingNews(): Promise<NewsResponse> {
    const response = await api.get('/news/breaking')
    return response.data
  },

  async getFeaturedNews(): Promise<NewsResponse> {
    const response = await api.get('/news/featured')
    return response.data
  },

  async getTrendingNews(): Promise<NewsResponse> {
    const response = await api.get('/news/trending')
    return response.data
  },

  async getArticle(articleId: string): Promise<NewsArticle> {
    const response = await api.get(`/news/article/${articleId}`)
    return response.data
  },

  async searchNews(query: string, filters: NewsFilters = {}): Promise<NewsResponse> {
    const params = new URLSearchParams()
    params.append('q', query)
    
    if (filters.source) params.append('source', filters.source)
    if (filters.category) params.append('category', filters.category)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await api.get(`/search?${params.toString()}`)
    return response.data
  },

  async getSources(): Promise<SourcesResponse> {
    const response = await api.get('/sources')
    return response.data
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const response = await api.get('/news/categories')
    return response.data
  },

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health')
    return response.data
  }
}