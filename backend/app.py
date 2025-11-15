"""
Flask Backend for Social Chat App
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Firebase Configuration
# TODO: আপনার Firebase credentials এখানে যোগ করুন

# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    User Sign Up Route
    Expected JSON:
    {
        "name": "string",
        "email": "string",
        "phone": "string",
        "dob": "YYYY-MM-DD",
        "gender": "Male/Female",
        "password": "string",
        "confirm_password": "string"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'confirm_password']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Check password match
        if data['password'] != data['confirm_password']:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400
        
        # Check password length
        if len(data['password']) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        # TODO: Firebase এ user তৈরি করুন
        # TODO: Database এ user info সেভ করুন
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully',
            'user': {
                'uid': 'user_id_here',
                'name': data['name'],
                'email': data['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    User Login Route
    Expected JSON:
    {
        "email_or_phone": "string",
        "password": "string"
    }
    """
    try:
        data = request.get_json()
        
        if 'email_or_phone' not in data or 'password' not in data:
            return jsonify({'success': False, 'message': 'Missing credentials'}), 400
        
        # TODO: Firebase এ user verify করুন
        # TODO: Token generate করুন
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': 'jwt_token_here',
            'user': {
                'uid': 'user_id_here',
                'name': 'User Name',
                'email': data['email_or_phone']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """
    Forgot Password Route
    Expected JSON:
    {
        "email_or_phone": "string",
        "name": "string",
        "dob": "YYYY-MM-DD"
    }
    """
    try:
        data = request.get_json()
        
        if 'email_or_phone' not in data:
            return jsonify({'success': False, 'message': 'Email or Phone required'}), 400
        
        # TODO: Verification logic
        
        return jsonify({
            'success': True,
            'message': 'Password reset instructions sent',
            'support_phone': '+880XXXXXXXXX',
            'whatsapp': '+880XXXXXXXXX'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== GOOGLE AUTH ====================

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """
    Google Authentication Route
    """
    try:
        data = request.get_json()
        google_token = data.get('google_token')
        
        # TODO: Google token verify করুন
        # TODO: Firebase এ user তৈরি বা login করুন
        
        return jsonify({
            'success': True,
            'message': 'Google authentication successful',
            'token': 'jwt_token_here'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== FACEBOOK AUTH ====================

@app.route('/api/auth/facebook', methods=['POST'])
def facebook_auth():
    """
    Facebook Authentication Route
    """
    try:
        data = request.get_json()
        facebook_token = data.get('facebook_token')
        
        # TODO: Facebook token verify করুন
        # TODO: Firebase এ user তৈরি বা login করুন
        
        return jsonify({
            'success': True,
            'message': 'Facebook authentication successful',
            'token': 'jwt_token_here'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Social Chat API is running',
        'timestamp': datetime.now().isoformat()
    }), 200


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500


if __name__ == '__main__':
    # Development mode
    app.run(debug=True, host='0.0.0.0', port=5000)
