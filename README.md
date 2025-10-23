
# News Portal

A modern news portal built with Next.js + TypeScript frontend and FastAPI backend. Users can browse news from multiple sources, filter by categories, and get personalized news feeds.

## Features

- 🚀 **Modern Stack**: Next.js 14 + TypeScript + FastAPI
- 📰 **Multi-Source News**: Scrapes from BBC, Reuters, TechCrunch
- 🔍 **Smart Filtering**: Filter by source and category
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast API**: Async news scraping with caching
- 🎨 **Beautiful UI**: Tailwind CSS with modern design

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- FastAPI (Python)
- BeautifulSoup4 for web scraping
- HTTPX for async HTTP requests
- Pydantic for data validation

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh

# Start both services
./start.sh
```

### Option 2: Manual Setup

**Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 main.py
```

**Frontend Setup (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Documentation**: http://localhost:8000/docs

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `GET /sources` - Available news sources
- `GET /news` - Get news with optional filters
- `GET /news/trending` - Get trending news
- `POST /preferences` - Save user preferences

## Development

### Adding New News Sources

Edit `NEWS_SOURCES` in `backend/main.py` to add new sources:

```python
"new_source": {
    "url": "https://example.com/news",
    "name": "Example News",
    "categories": {
        "world": "https://example.com/world",
        "tech": "https://example.com/tech"
    }
}
```

### Environment Variables

Backend (`.env`):
```
FRONTEND_URL=http://localhost:3000
API_PORT=8000
ENVIRONMENT=development
```

Frontend (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

