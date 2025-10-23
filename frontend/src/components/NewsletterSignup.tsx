'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { userService } from '@/services/userService'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      await userService.subscribeNewsletter(email)
      setIsSubscribed(true)
      setEmail('')
    } catch (error) {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-bold text-green-800 mb-2">Successfully Subscribed!</h3>
        <p className="text-green-600 text-sm">
          You'll receive our daily newsletter with the latest news updates.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
      <div className="text-center mb-4">
        <Mail className="h-8 w-8 mx-auto mb-3 opacity-90" />
        <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
        <p className="text-primary-100 text-sm">
          Get daily news digest delivered to your inbox
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 outline-none"
        />
        
        {error && (
          <p className="text-red-200 text-sm">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="w-full bg-white text-primary-600 font-medium py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>

      <p className="text-primary-100 text-xs text-center mt-3">
        No spam, unsubscribe anytime
      </p>
    </div>
  )
}