from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uuid
import os
import json
import hashlib
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Messenger API (dev)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Database file
DB_FILE = os.path.join(os.path.dirname(__file__), 'users_db.json')

# Static SPA directory
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')
os.makedirs(STATIC_DIR, exist_ok=True)

# Mount static files
app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')

# Simple in-memory connections for demo
connections = set()

# ==================== DATABASE FUNCTIONS ====================
def load_db():
    """Load users database from JSON file"""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"users": [], "next_id": 10001}

def save_db(db):
    """Save users database to JSON file"""
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_user_id():
    """Generate unique user ID"""
    db = load_db()
    user_id = db.get("next_id", 10001)
    db["next_id"] = user_id + 1
    save_db(db)
    return user_id

def generate_id_number(user_id: int) -> str:
    """Generate ID number like FWP123ABC"""
    import random
    import string
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"FWP{user_id}{suffix}"

# ==================== PYDANTIC MODELS ====================
class SignupRequest(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    dob: Optional[str] = None
    gender: Optional[str] = "Male"

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    profilePic: Optional[str] = None
    profileBackground: Optional[str] = None

# ==================== AUTH ENDPOINTS ====================
@app.post('/auth/signup')
async def auth_signup(req: SignupRequest):
    """Create new user account"""
    db = load_db()
    
    # Check if email/phone already exists
    for user in db["users"]:
        if req.email and user.get("email") == req.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        if req.phone and user.get("phone") == req.phone:
            raise HTTPException(status_code=400, detail="Phone already registered")
    
    # Generate unique user ID
    user_id = generate_user_id()
    id_number = generate_id_number(user_id)
    
    # Create new user
    new_user = {
        "id": user_id,
        "idNumber": id_number,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "password": hash_password(req.password),
        "dob": req.dob,
        "gender": req.gender,
        "bio": "Write a short bio...",
        "profilePic": "",
        "profileBackground": "/backgrounds/bg1.svg",
        "stats": {
            "followers": 0,
            "following": 0,
            "posts": 0
        },
        "wallet": {
            "goldCoins": 100
        },
        "createdAt": datetime.now().isoformat()
    }
    
    db["users"].append(new_user)
    save_db(db)
    
    # Remove password from response
    user_response = {k: v for k, v in new_user.items() if k != 'password'}
    
    # Generate token (simple UUID for now)
    token = str(uuid.uuid4())
    
    return {
        "ok": True,
        "message": f"Account created successfully! Your ID: {id_number}",
        "user": user_response,
        "token": token
    }

@app.post('/auth/login')
async def auth_login(req: LoginRequest):
    """Login with email/phone and password"""
    db = load_db()
    
    # Find user by email or phone
    user = None
    for u in db["users"]:
        if u.get("email") == req.email or u.get("phone") == req.email:
            user = u
            break
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Verify password
    if user["password"] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != 'password'}
    
    # Generate token
    token = str(uuid.uuid4())
    
    return {
        "ok": True,
        "message": "Login successful",
        "user": user_response,
        "token": token
    }

@app.get('/auth/me')
async def get_current_user():
    """Get current user (mock - returns demo user)"""
    # In production, verify token and return actual user
    db = load_db()
    if db["users"]:
        user = db["users"][0].copy()
        user.pop("password", None)
        return {"ok": True, "user": user}
    return {"ok": False, "user": None}

@app.put('/auth/profile')
async def update_profile(req: UpdateProfileRequest):
    """Update user profile"""
    db = load_db()
    
    # For demo, update first user (in production, use token to identify user)
    if not db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = db["users"][0]
    
    # Update fields
    if req.name:
        user["name"] = req.name
    if req.bio:
        user["bio"] = req.bio
    if req.profilePic:
        user["profilePic"] = req.profilePic
    if req.profileBackground:
        user["profileBackground"] = req.profileBackground
    
    save_db(db)
    
    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != 'password'}
    
    return {
        "ok": True,
        "message": "Profile updated successfully",
        "user": user_response
    }

# ==================== OTHER ENDPOINTS ====================
@app.get('/')
async def root():
    index_path = os.path.join(STATIC_DIR, 'index.html')
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type='text/html')
    return {"message": "Messenger API (dev) running", "users": len(load_db()["users"])}

@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for conn in list(connections):
                try:
                    await conn.send_text(data)
                except Exception:
                    try:
                        await conn.close()
                    except Exception:
                        pass
    except Exception:
        pass
    finally:
        try:
            connections.discard(websocket)
            await websocket.close()
        except Exception:
            pass

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail='No filename')
    ext = os.path.splitext(file.filename)[1]
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    with open(path, 'wb') as f:
        f.write(await file.read())
    return {"url": f"/uploads/{name}"}

@app.get('/uploads/{filename}')
async def serve_upload(filename: str):
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail='Not found')
    return FileResponse(path)

@app.post('/messages/send')
async def send_message(req: dict):
    return {
        "messageId": f"msg_{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.now().isoformat(),
        "status": "sent"
    }

@app.post('/attachments/upload')
async def upload_attachment(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail='No filename')
    ext = os.path.splitext(file.filename)[1]
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    with open(path, 'wb') as f:
        f.write(await file.read())
    return {
        "attachmentId": f"att_{uuid.uuid4().hex[:8]}",
        "url": f"/uploads/{name}",
        "fileName": file.filename,
        "mimeType": file.content_type
    }

@app.get('/conversations/{conversation_id}')
async def get_conversation(conversation_id: str):
    return {
        "conversationId": conversation_id,
        "messages": [
            {
                "id": "msg_001",
                "senderId": "user_123",
                "type": "text",
                "content": "Hello!",
                "timestamp": datetime.now().isoformat(),
                "status": "read"
            }
        ]
    }

@app.post('/stories/upload')
async def upload_story(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail='No filename')
    ext = os.path.splitext(file.filename)[1]
    name = f"story_{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    with open(path, 'wb') as f:
        f.write(await file.read())
    return {
        "storyId": f"story_{uuid.uuid4().hex[:8]}",
        "url": f"/uploads/{name}",
        "expiresAt": datetime.now().isoformat()
    }

@app.get('/{full_path:path}')
async def spa_fallback(full_path: str):
    index_path = os.path.join(STATIC_DIR, 'index.html')
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type='text/html')
    return {"message": "Messenger API (dev) running"}
