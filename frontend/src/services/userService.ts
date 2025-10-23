import axios from 'axios'
import { User, UserRegistration, UserLogin, UserPreferences, NewsResponse } from '@/types/news'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const userService = {
  async register(userData: UserRegistration): Promise<{ message: string; user_id: string }> {
    const response = await api.post('/users/register', userData)
    return response.data
  },

  async login(loginData: UserLogin): Promise<{ message: string; user_id: string; user: User }> {
    const response = await api.post('/users/login', loginData)
    return response.data
  },

  async getBookmarks(userId: string): Promise<{ bookmarks: any[] }> {
    const response = await api.get(`/users/${userId}/bookmarks`)
    return response.data
  },

  async bookmarkArticle(articleId: string, userId: string): Promise<{ message: string }> {
    const response = await api.post(`/news/article/${articleId}/bookmark`, null, {
      params: { user_id: userId }
    })
    return response.data
  },

  async removeBookmark(articleId: string, userId: string): Promise<{ message: string }> {
    const response = await api.delete(`/news/article/${articleId}/bookmark`, {
      params: { user_id: userId }
    })
    return response.data
  },

  async savePreferences(userId: string, preferences: UserPreferences): Promise<{ message: string }> {
    const response = await api.post(`/users/${userId}/preferences`, preferences)
    return response.data
  },

  async getPersonalizedFeed(userId: string, page: number = 1, perPage: number = 10): Promise<NewsResponse> {
    const response = await api.get(`/users/${userId}/feed`, {
      params: { page, per_page: perPage }
    })
    return response.data
  },

  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    const response = await api.get('/newsletter/subscribe', {
      params: { email }
    })
    return response.data
  }
}