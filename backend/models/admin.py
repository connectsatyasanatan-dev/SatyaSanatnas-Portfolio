import hashlib
import jwt
import datetime
import os
import logging
from functools import wraps
from flask import request, jsonify, current_app

logger = logging.getLogger(__name__)

ADMIN_CREDENTIALS = {
    "username": os.getenv("ADMIN_USERNAME", "Admin"),
    # Store hashed password — hash of env var password
    "password_hash": hashlib.sha256(
        os.getenv("ADMIN_PASSWORD", "Admin@123").encode()
    ).hexdigest(),
    "email": os.getenv("ADMIN_EMAIL", "admin@portfolio.dev"),
}


def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain: str) -> bool:
    """Verify plain password against stored hash"""
    return hash_password(plain) == ADMIN_CREDENTIALS["password_hash"]


def generate_token(username: str) -> str:
    """Generate JWT token with configurable expiry"""
    expiry_hours = int(os.getenv("JWT_EXPIRY_HOURS", 24))
    payload = {
        "username": username,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_hours),
    }
    secret = os.getenv("JWT_SECRET_KEY") or current_app.config["SECRET_KEY"]
    return jwt.encode(payload, secret, algorithm="HS256")


def verify_token(token: str):
    """Verify JWT token, return username or None"""
    try:
        secret = os.getenv("JWT_SECRET_KEY") or current_app.config["SECRET_KEY"]
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload["username"]
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None


def admin_required(f):
    """Decorator to require admin authentication"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header:
            return jsonify({"error": "No token provided"}), 401

        token = auth_header[7:] if auth_header.startswith("Bearer ") else auth_header
        username = verify_token(token)
        if not username:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_function
