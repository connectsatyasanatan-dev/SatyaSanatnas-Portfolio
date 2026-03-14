from flask import Blueprint, jsonify, request, current_app
from flask_mail import Message
from models.database import db

api = Blueprint("api", __name__)


@api.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Flask backend is running!"})


@api.route("/personal-info", methods=["GET"])
def get_personal_info():
    """Get personal information"""
    return jsonify(db.get_personal_info())


@api.route("/skills", methods=["GET"])
def get_skills():
    """Get all skills data"""
    return jsonify(db.get_skills())


@api.route("/skills/<category>", methods=["GET"])
def get_skills_by_category(category):
    """Get skills by category (frontend, backend, database, cloud)"""
    skills = db.get_skills()
    if category in skills:
        return jsonify(skills[category])
    return jsonify({"error": "Category not found"}), 404


@api.route("/projects", methods=["GET"])
def get_projects():
    """Get all projects"""
    projects = db.get_projects()
    featured_only = request.args.get("featured", "false").lower() == "true"
    if featured_only:
        featured_projects = [p for p in projects if p.get("featured", False)]
        return jsonify(featured_projects)
    return jsonify(projects)


@api.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    """Get specific project by ID"""
    projects = db.get_projects()
    project = next((p for p in projects if p["id"] == project_id), None)
    if project:
        return jsonify(project)
    return jsonify({"error": "Project not found"}), 404


@api.route("/experience", methods=["GET"])
def get_experience():
    """Get work experience"""
    return jsonify(db.get_experience())


@api.route("/education", methods=["GET"])
def get_education():
    """Get education"""
    return jsonify(db.get_education())


@api.route("/certifications", methods=["GET"])
def get_certifications():
    """Get certifications"""
    return jsonify(db.get_certifications())


@api.route("/achievements", methods=["GET"])
def get_achievements():
    """Get achievements"""
    return jsonify(db.get_achievements())


@api.route("/testimonials", methods=["GET"])
def get_testimonials():
    """Get testimonials"""
    return jsonify(db.get_testimonials())


@api.route("/blog", methods=["GET"])
def get_blog_posts():
    """Get blog posts"""
    posts = db.get_blog_posts()
    featured_only = request.args.get("featured", "false").lower() == "true"
    if featured_only:
        featured_posts = [p for p in posts if p.get("featured", False)]
        return jsonify(featured_posts)
    return jsonify(posts)


@api.route("/contact", methods=["POST"])
def contact_form():
    """Handle contact form submission: save to DB, send email to portfolio owner."""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "email", "message"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        name = data["name"].strip()
        email = data["email"].strip()
        subject = (data.get("subject") or "Portfolio Contact Form").strip()
        message_text = data["message"].strip()

        # 1. Save to database
        db.add_contact_message(name=name, email=email, subject=subject, message=message_text)

        # 2. Send email to portfolio owner (if mail is configured and owner has email)
        personal_info = db.get_personal_info()
        owner_email = (personal_info.get("email") or "").strip()
        if owner_email and current_app.extensions.get("mail"):
            try:
                mail = current_app.extensions["mail"]
                msg = Message(
                    subject=f"[Portfolio] {subject}" if subject else "[Portfolio] New contact message",
                    recipients=[owner_email],
                    body=(
                        f"New message from your portfolio contact form\n\n"
                        f"From: {name} <{email}>\n"
                        f"Subject: {subject}\n\n"
                        f"Message:\n{message_text}"
                    ),
                )
                mail.send(msg)
            except Exception as mail_err:
                # Log but don't fail the request; message is already saved
                current_app.logger.warning(f"Contact form: email send failed: {mail_err}")

        response_data = {
            "success": True,
            "message": "Thank you for your message! I'll get back to you soon.",
            "data": {
                "name": name,
                "email": email,
                "subject": subject,
            },
        }
        return jsonify(response_data), 200

    except Exception as e:
        return (
            jsonify({"error": "Failed to process contact form", "details": str(e)}),
            500,
        )


@api.route("/stats", methods=["GET"])
def get_stats():
    """Get portfolio statistics"""
    projects = db.get_projects()
    skills = db.get_skills()
    testimonials = db.get_testimonials()
    blog_posts = db.get_blog_posts()
    achievements = db.get_achievements()
    stats_data = achievements.get("stats", {})

    stats = {
        "projects_count": stats_data.get("projectsCompleted", len(projects)),
        "featured_projects": len([p for p in projects if p.get("featured", False)]),
        "total_stars": sum(p.get("stars", 0) for p in projects),
        "total_forks": sum(p.get("forks", 0) for p in projects),
        "experience_years": stats_data.get("yearsOfExperience", 0),
        "skills_count": sum(len(category["skills"]) for category in skills.values()),
        "testimonials_count": len(testimonials),
        "blog_posts_count": len(blog_posts),
        "clients_satisfied": stats_data.get("clientsSatisfied", 0),
        "code_commits": stats_data.get("codeCommits", 0),
        "lines_of_code": stats_data.get("linesOfCode", 0),
        "coffee_consumed": stats_data.get("coffeeConsumed", 0)
    }
    return jsonify(stats)
