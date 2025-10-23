from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import httpx
from bs4 import BeautifulSoup
import asyncio
from datetime import datetime, timedelta
import uvicorn
import json
import hashlib
import uuid
from enum import Enum

app = FastAPI(title="News Portal API", version="1.0.0")

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CategoryEnum(str, Enum):
    BREAKING = "breaking"
    POLITICS = "politics"
    BUSINESS = "business"
    TECHNOLOGY = "technology"
    SPORTS = "sports"
    ENTERTAINMENT = "entertainment"
    HEALTH = "health"
    SCIENCE = "science"
    WORLD = "world"
    NATIONAL = "national"

class NewsArticle(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    url: str
    summary: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    published_date: Optional[str] = None
    source: str
    category: Optional[str] = None
    tags: List[str] = []
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    read_time: Optional[int] = None  # in minutes
    views: int = 0
    is_breaking: bool = False
    is_featured: bool = False
    is_trending: bool = False
    related_articles: List[str] = []

class NewsResponse(BaseModel):
    articles: List[NewsArticle]
    total: int
    source: str
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    preferences: Dict[str, Any] = {}
    bookmarks: List[str] = []
    subscription_active: bool = False
    created_at: str
    last_login: Optional[str] = None

class UserRegistration(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPreferences(BaseModel):
    categories: List[str] = []
    sources: List[str] = []
    location: Optional[str] = None
    dark_mode: bool = False
    notifications: bool = True

class Comment(BaseModel):
    id: str
    article_id: str
    user_id: str
    user_name: str
    content: str
    created_at: str
    approved: bool = False
    replies: List['Comment'] = []

class SearchQuery(BaseModel):
    query: str
    category: Optional[str] = None
    source: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None

class AnalyticsData(BaseModel):
    total_articles: int
    total_views: int
    top_categories: Dict[str, int]
    trending_articles: List[NewsArticle]
    daily_views: Dict[str, int]

# In-memory storage (replace with database in production)
users_db = {}
articles_db = {}
comments_db = {}
analytics_db = {
    "views": {},
    "popular_articles": [],
    "trending_tags": {}
}

# News sources configuration
NEWS_SOURCES = {
    "bbc": {
        "url": "https://www.bbc.com/news",
        "name": "BBC News",
        "categories": {
            "breaking": "https://www.bbc.com/news",
            "world": "https://www.bbc.com/news/world",
            "politics": "https://www.bbc.com/news/politics",
            "business": "https://www.bbc.com/news/business",
            "technology": "https://www.bbc.com/news/technology",
            "health": "https://www.bbc.com/news/health",
            "science": "https://www.bbc.com/news/science-environment",
            "entertainment": "https://www.bbc.com/news/entertainment-arts"
        }
    },
    "reuters": {
        "url": "https://www.reuters.com/world/",
        "name": "Reuters",
        "categories": {
            "world": "https://www.reuters.com/world/",
            "politics": "https://www.reuters.com/news/politics/",
            "business": "https://www.reuters.com/business/",
            "technology": "https://www.reuters.com/technology/",
            "sports": "https://www.reuters.com/sports/"
        }
    },
    "techcrunch": {
        "url": "https://techcrunch.com",
        "name": "TechCrunch",
        "categories": {
            "technology": "https://techcrunch.com",
            "business": "https://techcrunch.com/category/startups/",
            "science": "https://techcrunch.com/category/science/"
        }
    },
    "cnn": {
        "url": "https://www.cnn.com",
        "name": "CNN",
        "categories": {
            "breaking": "https://www.cnn.com/world",
            "politics": "https://www.cnn.com/politics",
            "business": "https://www.cnn.com/business",
            "sports": "https://www.cnn.com/sport",
            "entertainment": "https://www.cnn.com/entertainment",
            "health": "https://www.cnn.com/health"
        }
    }
}

# Breaking news keywords for detection
BREAKING_NEWS_KEYWORDS = [
    "breaking", "urgent", "alert", "developing", "live", "update",
    "emergency", "crisis", "major", "significant", "important"
]

def calculate_read_time(content: str) -> int:
    """Calculate estimated read time in minutes"""
    words = len(content.split())
    return max(1, words // 200)  # Average reading speed: 200 words per minute

def is_breaking_news(title: str, content: str = "") -> bool:
    """Detect if news is breaking based on keywords"""
    text = (title + " " + content).lower()
    return any(keyword in text for keyword in BREAKING_NEWS_KEYWORDS)

def generate_article_id(title: str, source: str) -> str:
    """Generate unique article ID"""
    return hashlib.md5(f"{title}_{source}_{datetime.now().date()}".encode()).hexdigest()

async def scrape_news_source(source_name: str, category: str = "general", limit: int = 10) -> List[NewsArticle]:
    """Scrape news from a specific source and category"""
    articles = []
    
    try:
        source_config = NEWS_SOURCES.get(source_name)
        if not source_config:
            return articles
            
        # Get URL for category or default
        if category in source_config.get("categories", {}):
            url = source_config["categories"][category]
        else:
            url = source_config["url"]
            
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=10.0)
            response.raise_for_status()
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Generic selectors for different news sites
        selectors = [
            'h1 a', 'h2 a', 'h3 a',  # Headlines with links
            '.story-headline a', '.headline a',  # Common class names
            '[data-testid="internal-link"]'  # BBC specific
        ]
        
        found_articles = []
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                found_articles.extend(elements[:limit])
                break
        
        for i, element in enumerate(found_articles[:limit]):
            title = element.get_text(strip=True)
            url_link = element.get('href', '')
            
            # Make URL absolute if it's relative
            if url_link.startswith('/'):
                base_url = f"https://{source_name}.com" if source_name != "bbc" else "https://www.bbc.com"
                url_link = base_url + url_link
            elif not url_link.startswith('http'):
                continue
                
            # Try to find image
            img_element = element.find_parent().find('img') if element.find_parent() else None
            image_url = img_element.get('src') if img_element else None
            
            if title and url_link:
                # Generate summary from title (in real app, scrape full content)
                summary = title[:200] + "..." if len(title) > 200 else title
                
                # Detect breaking news
                breaking = is_breaking_news(title)
                
                # Generate tags from title
                tags = [word.lower() for word in title.split() if len(word) > 4][:5]
                
                article_id = generate_article_id(title, source_name)
                
                article = NewsArticle(
                    id=article_id,
                    title=title,
                    subtitle=f"Latest from {source_config['name']}",
                    url=url_link,
                    summary=summary,
                    author=f"{source_config['name']} Reporter",
                    source=source_config["name"],
                    category=category,
                    tags=tags,
                    published_date=datetime.now().isoformat(),
                    image_url=image_url,
                    read_time=calculate_read_time(summary),
                    is_breaking=breaking,
                    is_featured=i < 3,  # First 3 articles are featured
                    is_trending=i < 5   # First 5 articles are trending
                )
                
                articles.append(article)
                articles_db[article_id] = article
    
    except Exception as e:
        print(f"Error scraping {source_name}: {str(e)}")
    
    return articles

@app.get("/")
async def root():
    return {"message": "News Portal API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/sources")
async def get_sources():
    """Get available news sources"""
    return {
        "sources": [
            {"id": key, "name": value["name"], "categories": list(value.get("categories", {}).keys())}
            for key, value in NEWS_SOURCES.items()
        ]
    }

@app.get("/news", response_model=NewsResponse)
async def get_news(
    source: Optional[str] = None,
    category: Optional[str] = None,
    page: int = 1,
    per_page: int = 10,
    search: Optional[str] = None
):
    """Get news articles with optional filtering"""
    all_articles = []
    
    if source and source in NEWS_SOURCES:
        articles = await scrape_news_source(source, category or "general", per_page * 2)
        all_articles.extend(articles)
        source_name = source
    else:
        tasks = []
        for source_name, config in NEWS_SOURCES.items():
            if category and category in config.get("categories", {}):
                tasks.append(scrape_news_source(source_name, category, per_page // len(NEWS_SOURCES) + 2))
            else:
                tasks.append(scrape_news_source(source_name, "general", per_page // len(NEWS_SOURCES) + 2))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)
        
        source_name = "all"
    
    # Search filtering
    if search:
        search_lower = search.lower()
        all_articles = [
            article for article in all_articles
            if search_lower in article.title.lower() or 
               search_lower in (article.summary or "").lower() or
               any(search_lower in tag for tag in article.tags)
        ]
    
    # Pagination
    total = len(all_articles)
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_articles = all_articles[start_idx:end_idx]
    
    return NewsResponse(
        articles=paginated_articles,
        total=total,
        source=source_name,
        page=page,
        per_page=per_page,
        has_next=end_idx < total,
        has_prev=page > 1
    )

@app.get("/news/trending", response_model=NewsResponse)
async def get_trending_news():
    """Get trending news from multiple sources"""
    return await get_news(per_page=20)

@app.get("/news/breaking", response_model=NewsResponse)
async def get_breaking_news():
    """Get breaking news from all sources"""
    all_articles = []
    
    tasks = [scrape_news_source(source, "breaking", 5) for source in NEWS_SOURCES.keys()]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for result in results:
        if isinstance(result, list):
            all_articles.extend(result)
    
    # Filter for breaking news
    breaking_articles = [article for article in all_articles if article.is_breaking]
    
    return NewsResponse(
        articles=breaking_articles[:10],
        total=len(breaking_articles),
        source="breaking",
        page=1,
        per_page=10,
        has_next=False,
        has_prev=False
    )

@app.get("/news/featured", response_model=NewsResponse)
async def get_featured_news():
    """Get featured/top stories"""
    all_articles = []
    
    tasks = [scrape_news_source(source, "general", 5) for source in NEWS_SOURCES.keys()]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for result in results:
        if isinstance(result, list):
            all_articles.extend(result)
    
    # Get featured articles
    featured_articles = [article for article in all_articles if article.is_featured]
    
    return NewsResponse(
        articles=featured_articles[:8],
        total=len(featured_articles),
        source="featured",
        page=1,
        per_page=8,
        has_next=False,
        has_prev=False
    )

@app.get("/news/categories")
async def get_categories():
    """Get all available categories"""
    categories = set()
    for source_config in NEWS_SOURCES.values():
        categories.update(source_config.get("categories", {}).keys())
    
    return {
        "categories": [
            {"id": cat, "name": cat.replace("_", " ").title(), "count": 0}
            for cat in sorted(categories)
        ]
    }

@app.get("/news/article/{article_id}")
async def get_article(article_id: str):
    """Get single article by ID"""
    if article_id not in articles_db:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article = articles_db[article_id]
    # Increment view count
    article.views += 1
    
    # Update analytics
    today = datetime.now().date().isoformat()
    if today not in analytics_db["views"]:
        analytics_db["views"][today] = 0
    analytics_db["views"][today] += 1
    
    return article

@app.post("/news/article/{article_id}/bookmark")
async def bookmark_article(article_id: str, user_id: str):
    """Bookmark an article for a user"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if article_id not in users_db[user_id].bookmarks:
        users_db[user_id].bookmarks.append(article_id)
    
    return {"message": "Article bookmarked successfully"}

@app.delete("/news/article/{article_id}/bookmark")
async def remove_bookmark(article_id: str, user_id: str):
    """Remove bookmark for an article"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if article_id in users_db[user_id].bookmarks:
        users_db[user_id].bookmarks.remove(article_id)
    
    return {"message": "Bookmark removed successfully"}

@app.post("/users/register")
async def register_user(user_data: UserRegistration):
    """Register a new user"""
    user_id = str(uuid.uuid4())
    
    # Check if email already exists
    for user in users_db.values():
        if user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        created_at=datetime.now().isoformat()
    )
    
    users_db[user_id] = new_user
    
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/users/login")
async def login_user(login_data: UserLogin):
    """User login"""
    # Simple login (in production, use proper authentication)
    for user_id, user in users_db.items():
        if user.email == login_data.email:
            user.last_login = datetime.now().isoformat()
            return {"message": "Login successful", "user_id": user_id, "user": user}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/users/{user_id}/bookmarks")
async def get_user_bookmarks(user_id: str):
    """Get user's bookmarked articles"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    bookmarked_articles = [
        articles_db[article_id] 
        for article_id in users_db[user_id].bookmarks 
        if article_id in articles_db
    ]
    
    return {"bookmarks": bookmarked_articles}

@app.post("/users/{user_id}/preferences")
async def save_user_preferences(user_id: str, preferences: UserPreferences):
    """Save user preferences"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    users_db[user_id].preferences = preferences.dict()
    
    return {"message": "Preferences saved successfully"}

@app.get("/users/{user_id}/feed")
async def get_personalized_feed(user_id: str, page: int = 1, per_page: int = 10):
    """Get personalized news feed based on user preferences"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    preferences = user.preferences
    
    # Get news based on preferred categories and sources
    preferred_categories = preferences.get("categories", [])
    preferred_sources = preferences.get("sources", [])
    
    all_articles = []
    
    if preferred_categories or preferred_sources:
        tasks = []
        for source_name in (preferred_sources if preferred_sources else NEWS_SOURCES.keys()):
            if source_name in NEWS_SOURCES:
                for category in (preferred_categories if preferred_categories else ["general"]):
                    tasks.append(scrape_news_source(source_name, category, 5))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)
    else:
        # Default feed
        return await get_news(page=page, per_page=per_page)
    
    # Remove duplicates and sort by date
    seen_titles = set()
    unique_articles = []
    for article in all_articles:
        if article.title not in seen_titles:
            seen_titles.add(article.title)
            unique_articles.append(article)
    
    # Pagination
    total = len(unique_articles)
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_articles = unique_articles[start_idx:end_idx]
    
    return NewsResponse(
        articles=paginated_articles,
        total=total,
        source="personalized",
        page=page,
        per_page=per_page,
        has_next=end_idx < total,
        has_prev=page > 1
    )

@app.post("/news/article/{article_id}/comments")
async def add_comment(article_id: str, comment_data: dict):
    """Add a comment to an article"""
    comment_id = str(uuid.uuid4())
    
    comment = Comment(
        id=comment_id,
        article_id=article_id,
        user_id=comment_data["user_id"],
        user_name=comment_data["user_name"],
        content=comment_data["content"],
        created_at=datetime.now().isoformat()
    )
    
    if article_id not in comments_db:
        comments_db[article_id] = []
    
    comments_db[article_id].append(comment)
    
    return {"message": "Comment added successfully", "comment_id": comment_id}

@app.get("/news/article/{article_id}/comments")
async def get_article_comments(article_id: str):
    """Get comments for an article"""
    comments = comments_db.get(article_id, [])
    approved_comments = [comment for comment in comments if comment.approved]
    
    return {"comments": approved_comments}

@app.get("/search")
async def search_news(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = None,
    source: Optional[str] = None,
    page: int = 1,
    per_page: int = 10
):
    """Search news articles"""
    return await get_news(
        source=source,
        category=category,
        page=page,
        per_page=per_page,
        search=q
    )

@app.get("/analytics", response_model=AnalyticsData)
async def get_analytics():
    """Get analytics data for admin dashboard"""
    # Get trending articles (most viewed)
    trending_articles = sorted(
        articles_db.values(),
        key=lambda x: x.views,
        reverse=True
    )[:10]
    
    # Category distribution
    category_counts = {}
    for article in articles_db.values():
        if article.category:
            category_counts[article.category] = category_counts.get(article.category, 0) + 1
    
    return AnalyticsData(
        total_articles=len(articles_db),
        total_views=sum(article.views for article in articles_db.values()),
        top_categories=category_counts,
        trending_articles=trending_articles,
        daily_views=analytics_db["views"]
    )

@app.get("/newsletter/subscribe")
async def subscribe_newsletter(email: EmailStr):
    """Subscribe to newsletter"""
    # In production, integrate with email service
    return {"message": f"Successfully subscribed {email} to newsletter"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)