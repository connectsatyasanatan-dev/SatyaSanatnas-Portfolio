import jwt
import datetime
import os
import logging
from functools import wraps
from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash

logger = logging.getLogger(__name__)


def _build_credentials():
    """Build admin credentials at startup — hashes password with bcrypt via werkzeug."""
    username = os.getenv("ADMIN_USERNAME", "Admin")
    password = os.getenv("ADMIN_PASSWORD", "Admin@123")
    email = os.getenv("ADMIN_EMAIL", "admin@portfolio.dev")

    # Warn loudly if default insecure values are still in use
    if password == "Admin@123":
        logger.warning(
            "SECURITY WARNING: Default ADMIN_PASSWORD is in use. "
            "Set a strong password in your environment before deploying to production."
        )
    return {
        "username": username,
        "password_hash": generate_password_hash(password),
        "email": email,
    }


ADMIN_CREDENTIALS = _build_credentials()


def verify_password(plain: str) -> bool:
    """Verify plain password against bcrypt hash."""
    return check_password_hash(ADMIN_CREDENTIALS["password_hash"], plain)


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
