'use client'

import { useState } from 'react'
import { Newspaper, Menu, X, User, Settings, Bookmark, Bell, Sun, Moon } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, this would update the theme context
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Newspaper className="h-8 w-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900">News Portal</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Home
            </a>
            <a href="/breaking" className="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Breaking
            </a>
            <a href="/trending" className="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Trending
            </a>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-500 transition-colors font-medium">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {['Politics', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'].map((category) => (
                    <a
                      key={category}
                      href={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <a href="/search" className="text-gray-700 hover:text-primary-500 transition-colors font-medium">
              Search
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-primary-500 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block">Account</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="py-2">
                    <a href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      Sign In
                    </a>
                    <a href="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      Sign Up
                    </a>
                    <hr className="my-2" />
                    <a href="/bookmarks" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarks
                    </a>
                    <a href="/preferences" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="h-4 w-4 mr-2" />
                      Preferences
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              <a href="/" className="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2">
                Home
              </a>
              <a href="/breaking" className="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2">
                Breaking News
              </a>
              <a href="/trending" className="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2">
                Trending
              </a>
              <a href="/search" className="text-gray-700 hover:text-primary-500 transition-colors font-medium py-2">
                Search
              </a>
              
              <div className="pt-2 border-t border-gray-200 mt-2">
                <p className="text-sm font-medium text-gray-500 mb-2">Categories</p>
                {['Politics', 'Technology', 'Business', 'Sports', 'Health', 'Entertainment'].map((category) => (
                  <a
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="block text-gray-600 hover:text-primary-500 transition-colors py-1 pl-4"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}