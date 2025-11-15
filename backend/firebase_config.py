"""
Firebase Configuration
"""
import firebase_admin
from firebase_admin import credentials, db, auth
import os
from dotenv import load_dotenv

load_dotenv()

# TODO: আপনার Firebase Service Account JSON ডাউনলোড করুন
# Firebase Console -> Project Settings -> Service Accounts -> Generate new private key

# Firebase initialization (আপনার credentials.json ফাইল ব্যবহার করুন)
# cred = credentials.Certificate('path/to/serviceAccountKey.json')
# firebase_admin.initialize_app(cred, {
#     'databaseURL': 'https://your-project.firebaseio.com'
# })

def get_auth():
    """Get Firebase Auth instance"""
    return auth

def get_db():
    """Get Firebase Database instance"""
    return db
