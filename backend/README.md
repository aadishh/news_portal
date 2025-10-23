# News Portal Backend

FastAPI backend for scraping and serving news from multiple sources.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Adding News Sources

Edit the `NEWS_SOURCES` dictionary in `main.py` to add new sources.