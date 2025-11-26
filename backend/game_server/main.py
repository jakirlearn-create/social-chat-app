from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
import os
from datetime import datetime
from probabilityControl import probability_controller

app = FastAPI(title="Game Server API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/games", StaticFiles(directory="game_server/games"), name="games")
app.mount("/assets", StaticFiles(directory="game_server/assets"), name="assets")

# Data models
class CoinCheckRequest(BaseModel):
    user_id: str
    amount: int

class CoinDeductRequest(BaseModel):
    user_id: str
    amount: int
    game_name: str

class CoinRewardRequest(BaseModel):
    user_id: str
    amount: int
    game_name: str

# In-memory wallet (replace with real database)
user_wallets = {}

# Game configuration
GAME_CONFIG = {
    "ludo": {"entry_fee": 10, "reward": 20, "enabled": True, "win_probability": 0.45},
    "carrom": {"entry_fee": 20, "reward": 40, "enabled": True, "win_probability": 0.40},
    "chicken_jump": {"entry_fee": 5, "reward": 10, "enabled": True, "win_probability": 0.50},
    "crash": {"entry_fee": 15, "reward": 30, "enabled": True, "win_probability": 0.35},
    "spin_wheel": {"entry_fee": 10, "reward": 25, "enabled": True, "win_probability": 0.42},
    "number_roll": {"entry_fee": 8, "reward": 16, "enabled": True, "win_probability": 0.47},
    "knife_hit": {"entry_fee": 12, "reward": 24, "enabled": True, "win_probability": 0.45},
    "fruit_slice": {"entry_fee": 10, "reward": 20, "enabled": True, "win_probability": 0.48},
    "memory_match": {"entry_fee": 5, "reward": 10, "enabled": True, "win_probability": 0.55},
    "tic_tac_toe": {"entry_fee": 5, "reward": 10, "enabled": True, "win_probability": 0.50},
}

# Initialize user wallet helper
def get_user_wallet(user_id: str):
    if user_id not in user_wallets:
        user_wallets[user_id] = 1000  # Starting balance
    return user_wallets[user_id]

@app.get("/")
def read_root():
    return {"message": "Game Server API is running", "timestamp": datetime.now().isoformat()}

@app.post("/api/checkCoin")
def check_coin(request: CoinCheckRequest):
    """Check if user has enough coins"""
    balance = get_user_wallet(request.user_id)
    has_enough = balance >= request.amount
    
    return {
        "success": True,
        "has_enough": has_enough,
        "current_balance": balance,
        "required_amount": request.amount
    }

@app.post("/api/deductCoin")
def deduct_coin(request: CoinDeductRequest):
    """Deduct coins when user enters a game"""
    balance = get_user_wallet(request.user_id)
    
    if balance < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient coins")
    
    user_wallets[request.user_id] = balance - request.amount
    
    # Log transaction
    transaction = {
        "user_id": request.user_id,
        "type": "deduct",
        "amount": request.amount,
        "game": request.game_name,
        "timestamp": datetime.now().isoformat(),
        "new_balance": user_wallets[request.user_id]
    }
    
    return {
        "success": True,
        "message": f"Deducted {request.amount} coins",
        "new_balance": user_wallets[request.user_id],
        "transaction": transaction
    }

@app.post("/api/rewardCoin")
def reward_coin(request: CoinRewardRequest):
    """Reward coins when user wins a game"""
    balance = get_user_wallet(request.user_id)
    user_wallets[request.user_id] = balance + request.amount
    
    # Log transaction
    transaction = {
        "user_id": request.user_id,
        "type": "reward",
        "amount": request.amount,
        "game": request.game_name,
        "timestamp": datetime.now().isoformat(),
        "new_balance": user_wallets[request.user_id]
    }
    
    return {
        "success": True,
        "message": f"Rewarded {request.amount} coins",
        "new_balance": user_wallets[request.user_id],
        "transaction": transaction
    }

@app.get("/api/games/config")
def get_game_config():
    """Get configuration for all games"""
    return {
        "success": True,
        "games": GAME_CONFIG
    }

@app.get("/api/games/{game_id}/config")
def get_single_game_config(game_id: str):
    """Get configuration for a specific game"""
    if game_id not in GAME_CONFIG:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {
        "success": True,
        "game": game_id,
        "config": GAME_CONFIG[game_id]
    }

@app.get("/api/wallet/{user_id}")
def get_wallet_balance(user_id: str):
    """Get user's current wallet balance"""
    balance = get_user_wallet(user_id)
    return {
        "success": True,
        "user_id": user_id,
        "balance": balance
    }

# Probability Control Endpoints
@app.get("/api/probability/all")
def get_all_probabilities():
    """Get win probabilities for all games"""
    return {
        "success": True,
        "probabilities": probability_controller.get_all_probabilities(),
        "house_edge": probability_controller.house_edge
    }

@app.get("/api/probability/{game_id}")
def get_game_probability(game_id: str, difficulty: str = "normal"):
    """Get win probability for a specific game"""
    prob = probability_controller.get_win_probability(game_id, difficulty)
    return {
        "success": True,
        "game_id": game_id,
        "difficulty": difficulty,
        "win_probability": prob
    }

@app.post("/api/probability/{game_id}/update")
def update_game_probability(game_id: str, new_probability: float):
    """Update win probability for a game (Admin only)"""
    success = probability_controller.update_probability(game_id, new_probability)
    if success:
        return {
            "success": True,
            "message": f"Updated {game_id} probability to {new_probability}"
        }
    raise HTTPException(status_code=400, detail="Invalid probability value")

@app.post("/api/probability/house-edge/update")
def update_house_edge(new_edge: float):
    """Update global house edge (Admin only)"""
    success = probability_controller.update_house_edge(new_edge)
    if success:
        return {
            "success": True,
            "message": f"Updated house edge to {new_edge}"
        }
    raise HTTPException(status_code=400, detail="Invalid house edge value")

@app.get("/api/probability/{game_id}/should-win")
def check_should_win(game_id: str, difficulty: str = "normal"):
    """Check if player should win this round"""
    should_win = probability_controller.should_player_win(game_id, difficulty)
    return {
        "success": True,
        "game_id": game_id,
        "should_win": should_win
    }

@app.get("/api/probability/{game_id}/expected-value")
def get_expected_value(game_id: str, entry_fee: int, reward: int, difficulty: str = "normal"):
    """Calculate expected value for player"""
    ev = probability_controller.calculate_expected_value(game_id, entry_fee, reward, difficulty)
    return {
        "success": True,
        "game_id": game_id,
        "expected_value": ev,
        "favorable_to_player": ev > 0
    }

@app.get("/api/probability/{game_id}/profit-margin")
def get_profit_margin(game_id: str, entry_fee: int, reward: int, difficulty: str = "normal"):
    """Calculate expected profit margin for house"""
    margin = probability_controller.get_house_profit_margin(game_id, entry_fee, reward, difficulty)
    return {
        "success": True,
        "game_id": game_id,
        "profit_margin_percentage": margin
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
