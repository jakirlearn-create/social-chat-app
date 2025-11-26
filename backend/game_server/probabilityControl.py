"""
Probability Control System
Controls win/loss ratios for all games
"""

import random
from typing import Dict

class ProbabilityController:
    def __init__(self):
        # Default win probabilities for each game
        self.probabilities = {
            "ludo": 0.45,
            "carrom": 0.40,
            "chicken_jump": 0.50,
            "crash": 0.35,
            "spin_wheel": 0.42,
            "number_roll": 0.47,
            "knife_hit": 0.45,
            "fruit_slice": 0.48,
            "memory_match": 0.55,
            "tic_tac_toe": 0.50,
        }
        
        # Difficulty levels
        self.difficulty_multipliers = {
            "easy": 1.2,      # 20% easier to win
            "normal": 1.0,    # Default
            "hard": 0.8,      # 20% harder to win
            "expert": 0.6,    # 40% harder to win
        }
        
        # Global house edge (profit margin for the platform)
        self.house_edge = 0.05  # 5% house edge
        
    def should_player_win(self, game_id: str, difficulty: str = "normal") -> bool:
        """
        Determine if player should win based on probability
        
        Args:
            game_id: Game identifier
            difficulty: Difficulty level (easy, normal, hard, expert)
            
        Returns:
            True if player should win, False otherwise
        """
        base_prob = self.probabilities.get(game_id, 0.45)
        difficulty_mult = self.difficulty_multipliers.get(difficulty, 1.0)
        
        # Apply difficulty multiplier
        adjusted_prob = base_prob * difficulty_mult
        
        # Apply house edge
        final_prob = adjusted_prob * (1 - self.house_edge)
        
        # Ensure probability is between 0 and 1
        final_prob = max(0.0, min(1.0, final_prob))
        
        # Random determination
        return random.random() < final_prob
    
    def get_win_probability(self, game_id: str, difficulty: str = "normal") -> float:
        """Get the actual win probability for a game"""
        base_prob = self.probabilities.get(game_id, 0.45)
        difficulty_mult = self.difficulty_multipliers.get(difficulty, 1.0)
        adjusted_prob = base_prob * difficulty_mult
        final_prob = adjusted_prob * (1 - self.house_edge)
        return max(0.0, min(1.0, final_prob))
    
    def update_probability(self, game_id: str, new_prob: float) -> bool:
        """
        Update win probability for a specific game
        
        Args:
            game_id: Game identifier
            new_prob: New probability (0.0 to 1.0)
            
        Returns:
            True if updated successfully
        """
        if 0.0 <= new_prob <= 1.0:
            self.probabilities[game_id] = new_prob
            return True
        return False
    
    def update_house_edge(self, new_edge: float) -> bool:
        """
        Update global house edge
        
        Args:
            new_edge: New house edge (0.0 to 1.0)
            
        Returns:
            True if updated successfully
        """
        if 0.0 <= new_edge <= 1.0:
            self.house_edge = new_edge
            return True
        return False
    
    def get_all_probabilities(self) -> Dict[str, float]:
        """Get all game probabilities"""
        return self.probabilities.copy()
    
    def calculate_expected_value(self, game_id: str, entry_fee: int, reward: int, 
                                 difficulty: str = "normal") -> float:
        """
        Calculate expected value for player
        
        Args:
            game_id: Game identifier
            entry_fee: Entry fee in coins
            reward: Reward for winning
            difficulty: Difficulty level
            
        Returns:
            Expected value (positive means player has advantage)
        """
        win_prob = self.get_win_probability(game_id, difficulty)
        lose_prob = 1 - win_prob
        
        expected_value = (win_prob * reward) - (lose_prob * entry_fee)
        return expected_value
    
    def get_house_profit_margin(self, game_id: str, entry_fee: int, reward: int,
                                difficulty: str = "normal") -> float:
        """
        Calculate expected profit margin for the house
        
        Args:
            game_id: Game identifier  
            entry_fee: Entry fee in coins
            reward: Reward for winning
            difficulty: Difficulty level
            
        Returns:
            Expected profit margin as percentage
        """
        win_prob = self.get_win_probability(game_id, difficulty)
        
        # Expected income per game
        expected_income = entry_fee
        
        # Expected payout per game
        expected_payout = win_prob * reward
        
        # Expected profit
        expected_profit = expected_income - expected_payout
        
        # Profit margin percentage
        profit_margin = (expected_profit / expected_income) * 100
        
        return profit_margin
    
    def adjust_difficulty_for_player_level(self, player_wins: int, player_losses: int) -> str:
        """
        Dynamically adjust difficulty based on player's win/loss record
        
        Args:
            player_wins: Number of wins
            player_losses: Number of losses
            
        Returns:
            Recommended difficulty level
        """
        if player_wins + player_losses < 10:
            return "normal"
        
        win_rate = player_wins / (player_wins + player_losses)
        
        if win_rate > 0.6:
            return "hard"
        elif win_rate > 0.5:
            return "normal"
        elif win_rate > 0.3:
            return "easy"
        else:
            return "easy"

# Global instance
probability_controller = ProbabilityController()
