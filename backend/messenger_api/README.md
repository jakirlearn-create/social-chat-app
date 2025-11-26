Messenger API (dev)

Run locally for development (requires Python 3.9+):

1. Create a virtualenv and install:

   python -m venv .venv
   .\.venv\Scripts\Activate.ps1   # on PowerShell
   pip install -r requirements.txt

2. Run with uvicorn:

   uvicorn main:app --reload --host 0.0.0.0 --port 8000

Endpoints:
- WebSocket: ws://localhost:8000/ws (echo server for dev)
- Upload: POST /upload (multipart/form-data file)
- Serve uploaded media: GET /uploads/{filename}

This is a small dev scaffold — for production use, add authentication, database storage (Postgres), Redis pub/sub for scaling, and message persistence.
