import hashlib
import jwt
import datetime
import os
from functools import wraps
from flask import request, jsonify, current_app

# Simple admin credentials (in production, use database)
ADMIN_CREDENTIALS = {
    "username": os.getenv("ADMIN_USERNAME", "Admin"),
    "password": os.getenv("ADMIN_PASSWORD", "Admin@123"),
    "email": os.getenv("ADMIN_EMAIL", "admin@portfolio.dev"),
}


def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed):
    """Verify password against hash"""
    return hash_password(password) == hashed


def generate_token(username):
    """Generate JWT token"""
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(
            token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        return payload["username"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def admin_required(f):
    """Decorator to require admin authentication"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "No token provided"}), 401

        if token.startswith("Bearer "):
            token = token[7:]

        username = verify_token(token)
        if not username:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_function
