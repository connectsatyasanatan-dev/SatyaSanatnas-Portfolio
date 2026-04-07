"""
limiter.py — Shared Flask-Limiter instance.
Import this in app.py to init_app() and in routes to apply decorators.
"""

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=[])
