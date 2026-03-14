"""
app.py — Flask application factory
Pure REST API backend — no template rendering.
All HTML is served by the Next.js / Vite frontend.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_mail import Mail

from config import Config
from routes.api import api
from routes.admin import admin


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ------------------------------------------------------------------
    # Extensions
    # ------------------------------------------------------------------
    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
    )
    Mail(app)

    # ------------------------------------------------------------------
    # Blueprints
    # ------------------------------------------------------------------
    app.register_blueprint(api,   url_prefix="/api")
    app.register_blueprint(admin, url_prefix="/api/admin")

    # ------------------------------------------------------------------
    # Root — API index (no HTML rendering)
    # ------------------------------------------------------------------
    @app.route("/")
    def index():
        return jsonify(
            {
                "message": "Portfolio Flask Backend API",
                "version": "1.0.0",
                "status": "running",
                "docs": "See README.md for full endpoint documentation",
                "endpoints": {
                    "health":        "GET  /api/health",
                    "personal_info": "GET  /api/personal-info",
                    "skills":        "GET  /api/skills",
                    "projects":      "GET  /api/projects",
                    "experience":    "GET  /api/experience",
                    "education":     "GET  /api/education",
                    "certifications":"GET  /api/certifications",
                    "achievements":  "GET  /api/achievements",
                    "testimonials":  "GET  /api/testimonials",
                    "blog":          "GET  /api/blog",
                    "contact":       "POST /api/contact",
                    "stats":         "GET  /api/stats",
                    "admin_login":   "POST /api/admin/login",
                    "admin_dashboard":"GET /api/admin/dashboard",
                },
            }
        )

    # ------------------------------------------------------------------
    # Error handlers — always return JSON, never HTML
    # ------------------------------------------------------------------
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request", "details": str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized"}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden"}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app
