from flask import Blueprint, request, jsonify
from models.admin import (
    ADMIN_CREDENTIALS,
    verify_password,
    generate_token,
    admin_required,
    hash_password,
)
from models.database import db
import json
import os

admin = Blueprint("admin", __name__)


@admin.route("/login", methods=["POST"])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        # Verify credentials
        if (
            username == ADMIN_CREDENTIALS["username"]
            and password == ADMIN_CREDENTIALS["password"]
        ):

            token = generate_token(username)
            return jsonify(
                {
                    "success": True,
                    "token": token,
                    "user": {"username": username, "email": ADMIN_CREDENTIALS["email"]},
                }
            )
        else:
            return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/verify", methods=["GET"])
@admin_required
def verify_admin():
    """Verify admin token"""
    return jsonify({"success": True, "message": "Token valid"})


# Personal Info Management
@admin.route("/personal-info", methods=["GET"])
@admin_required
def get_admin_personal_info():
    """Get personal info for editing"""
    return jsonify(db.get_personal_info())


@admin.route("/personal-info", methods=["PUT"])
@admin_required
def update_personal_info():
    """Update personal information"""
    try:
        data = request.get_json()
        db.update_personal_info(data)

        return jsonify(
            {
                "success": True,
                "message": "Personal info updated successfully",
                "data": db.get_personal_info(),
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Skills Management
@admin.route("/skills", methods=["GET"])
@admin_required
def get_admin_skills():
    """Get all skills for editing"""
    return jsonify(db.get_skills())


@admin.route("/skills/<category>", methods=["PUT"])
@admin_required
def update_skills_category(category):
    """Update skills in a specific category"""
    try:
        data = request.get_json()
        db.update_skills_category(category, data)

        return jsonify(
            {
                "success": True,
                "message": f"{category} skills updated successfully",
                "data": db.get_skills()[category],
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/skills/<category>/skill", methods=["POST"])
@admin_required
def add_skill(category):
    """Add new skill to category"""
    try:
        data = request.get_json()
        skills = db.get_skills()

        if category in skills:
            new_skill = {
                "name": data.get("name"),
                "level": data.get("level", 50),
                "years": data.get("years", 1),
            }

            skills[category]["skills"].append(new_skill)
            db.update_skills_category(category, skills[category])

            return jsonify(
                {
                    "success": True,
                    "message": "Skill added successfully",
                    "data": new_skill,
                }
            )
        else:
            return jsonify({"error": "Category not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Projects Management
@admin.route("/projects", methods=["GET"])
@admin_required
def get_admin_projects():
    """Get all projects for editing"""
    return jsonify(db.get_projects())


@admin.route("/projects", methods=["POST"])
@admin_required
def add_project():
    """Add new project"""
    try:
        data = request.get_json()
        project_id = db.add_project(data)

        # Get the newly created project
        projects = db.get_projects()
        new_project = next((p for p in projects if p["id"] == project_id), None)

        return jsonify(
            {
                "success": True,
                "message": "Project added successfully",
                "data": new_project,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/projects/<int:project_id>", methods=["PUT"])
@admin_required
def update_project(project_id):
    """Update existing project"""
    try:
        data = request.get_json()
        db.update_project(project_id, data)

        # Get updated project
        projects = db.get_projects()
        project = next((p for p in projects if p["id"] == project_id), None)

        return jsonify(
            {
                "success": True,
                "message": "Project updated successfully",
                "data": project,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/projects/<int:project_id>", methods=["DELETE"])
@admin_required
def delete_project(project_id):
    """Delete project"""
    try:
        db.delete_project(project_id)
        return jsonify({"success": True, "message": "Project deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Experience Management
@admin.route("/experience", methods=["GET"])
@admin_required
def get_admin_experience():
    """Get all experience for editing"""
    return jsonify(db.get_experience())


@admin.route("/experience", methods=["POST"])
@admin_required
def add_experience():
    """Add new experience"""
    try:
        data = request.get_json()
        exp_id = db.add_experience(data)

        # Get the newly created experience
        experiences = db.get_experience()
        new_experience = next((e for e in experiences if e["id"] == exp_id), None)

        return jsonify(
            {
                "success": True,
                "message": "Experience added successfully",
                "data": new_experience,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/experience/<int:exp_id>", methods=["PUT"])
@admin_required
def update_experience(exp_id):
    """Update experience by ID. Persists to DB; same data is served to main portfolio via GET /api/experience."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        updated = db.update_experience(exp_id, data)
        if not updated:
            return jsonify({"error": "Experience entry not found"}), 404

        # Return updated row so frontend can refresh
        experiences = db.get_experience()
        experience = next((e for e in experiences if e["id"] == exp_id), None)
        return jsonify(
            {
                "success": True,
                "message": "Experience updated successfully",
                "data": experience,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/experience/<int:exp_id>", methods=["DELETE"])
@admin_required
def delete_experience(exp_id):
    """Delete experience by ID"""
    try:
        db.delete_experience(exp_id)
        return jsonify({"success": True, "message": "Experience deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Education Management
@admin.route("/education", methods=["GET"])
@admin_required
def get_admin_education():
    """Get all education"""
    return jsonify(db.get_education())


@admin.route("/education", methods=["POST"])
@admin_required
def add_education():
    """Add education"""
    try:
        data = request.get_json()
        edu_id = db.add_education(data)
        
        # Get newly created
        edu_list = db.get_education()
        new_edu = next((e for e in edu_list if e["id"] == edu_id), None)
        return jsonify({"success": True, "message": "Education added successfully", "data": new_edu})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/education/<int:edu_id>", methods=["PUT"])
@admin_required
def update_education(edu_id):
    """Update education"""
    try:
        data = request.get_json()
        db.update_education(edu_id, data)
        
        edu_list = db.get_education()
        updated_edu = next((e for e in edu_list if e["id"] == edu_id), None)
        return jsonify({"success": True, "message": "Education updated successfully", "data": updated_edu})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/education/<int:edu_id>", methods=["DELETE"])
@admin_required
def delete_education(edu_id):
    """Delete education"""
    try:
        db.delete_education(edu_id)
        return jsonify({"success": True, "message": "Education deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Certifications Management
@admin.route("/certifications", methods=["GET"])
@admin_required
def get_admin_certifications():
    """Get all certifications"""
    return jsonify(db.get_certifications())


@admin.route("/certifications", methods=["POST"])
@admin_required
def add_certification():
    """Add certification"""
    try:
        data = request.get_json()
        cert_id = db.add_certification(data)
        
        cert_list = db.get_certifications()
        new_cert = next((c for c in cert_list if c["id"] == cert_id), None)
        return jsonify({"success": True, "message": "Certification added successfully", "data": new_cert})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/certifications/<int:cert_id>", methods=["PUT"])
@admin_required
def update_certification(cert_id):
    """Update certification"""
    try:
        data = request.get_json()
        db.update_certification(cert_id, data)
        
        cert_list = db.get_certifications()
        updated_cert = next((c for c in cert_list if c["id"] == cert_id), None)
        return jsonify({"success": True, "message": "Certification updated successfully", "data": updated_cert})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/certifications/<int:cert_id>", methods=["DELETE"])
@admin_required
def delete_certification(cert_id):
    """Delete certification"""
    try:
        db.delete_certification(cert_id)
        return jsonify({"success": True, "message": "Certification deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Achievements Management
@admin.route("/achievements", methods=["GET"])
@admin_required
def get_admin_achievements():
    """Get achievements"""
    return jsonify(db.get_achievements())


@admin.route("/achievements/<category>", methods=["PUT"])
@admin_required
def update_achievements(category):
    """Update achievements category (stats or highlights)"""
    try:
        data = request.get_json()
        db.update_achievements(category, data)
        return jsonify({"success": True, "message": f"{category} updated successfully", "data": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Testimonials Management
@admin.route("/testimonials", methods=["GET"])
@admin_required
def get_admin_testimonials():
    """Get all testimonials for editing"""
    return jsonify(db.get_testimonials())


@admin.route("/testimonials", methods=["POST"])
@admin_required
def add_testimonial():
    """Add new testimonial"""
    try:
        data = request.get_json()
        testimonial_id = db.add_testimonial(data)

        # Get the newly created testimonial
        testimonials = db.get_testimonials()
        new_testimonial = next(
            (t for t in testimonials if t["id"] == testimonial_id), None
        )

        return jsonify(
            {
                "success": True,
                "message": "Testimonial added successfully",
                "data": new_testimonial,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/testimonials/<int:testimonial_id>", methods=["PUT"])
@admin_required
def update_testimonial(testimonial_id):
    """Update testimonial by ID"""
    try:
        data = request.get_json()
        db.update_testimonial(testimonial_id, data)

        # Get updated testimonial
        testimonials = db.get_testimonials()
        testimonial = next((t for t in testimonials if t["id"] == testimonial_id), None)

        return jsonify(
            {
                "success": True,
                "message": "Testimonial updated successfully",
                "data": testimonial,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/testimonials/<int:testimonial_id>", methods=["DELETE"])
@admin_required
def delete_testimonial(testimonial_id):
    """Delete testimonial by ID"""
    try:
        db.delete_testimonial(testimonial_id)
        return jsonify({"success": True, "message": "Testimonial deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Blog Posts Management
@admin.route("/blog", methods=["GET"])
@admin_required
def get_admin_blog():
    """Get all blog posts for editing"""
    return jsonify(db.get_blog_posts())


@admin.route("/blog", methods=["POST"])
@admin_required
def add_blog_post():
    """Add new blog post"""
    try:
        data = request.get_json()
        post_id = db.add_blog_post(data)

        # Get the newly created post
        posts = db.get_blog_posts()
        new_post = next((p for p in posts if p["id"] == post_id), None)

        return jsonify(
            {
                "success": True,
                "message": "Blog post added successfully",
                "data": new_post,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/blog/<int:post_id>", methods=["PUT"])
@admin_required
def update_blog_post(post_id):
    """Update blog post"""
    try:
        data = request.get_json()
        db.update_blog_post(post_id, data)

        # Get updated post
        posts = db.get_blog_posts()
        post = next((p for p in posts if p["id"] == post_id), None)

        return jsonify(
            {"success": True, "message": "Blog post updated successfully", "data": post}
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin.route("/blog/<int:post_id>", methods=["DELETE"])
@admin_required
def delete_blog_post(post_id):
    """Delete blog post"""
    try:
        db.delete_blog_post(post_id)
        return jsonify({"success": True, "message": "Blog post deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Contact Messages (from portfolio Send Message form)
@admin.route("/contacts", methods=["GET"])
@admin_required
def get_contacts():
    """Get all contact form submissions"""
    return jsonify(db.get_contact_messages())


@admin.route("/contacts/<int:message_id>", methods=["DELETE"])
@admin_required
def delete_contact_message(message_id):
    """Delete a contact message"""
    try:
        db.delete_contact_message(message_id)
        return jsonify({"success": True, "message": "Contact message deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Dashboard Stats
@admin.route("/dashboard", methods=["GET"])
@admin_required
def admin_dashboard():
    """Get admin dashboard statistics"""
    projects = db.get_projects()
    experience = db.get_experience()
    testimonials = db.get_testimonials()
    blog_posts = db.get_blog_posts()
    skills = db.get_skills()
    contact_messages = db.get_contact_messages()

    return jsonify(
        {
            "stats": {
                "projects": len(projects),
                "featured_projects": len(
                    [p for p in projects if p.get("featured", False)]
                ),
                "experience_entries": len(experience),
                "testimonials": len(testimonials),
                "blog_posts": len(blog_posts),
                "skills_categories": len(skills),
                "total_skills": sum(
                    len(category["skills"]) for category in skills.values()
                ),
                "contact_messages": len(contact_messages),
            },
            "recent_activity": [
                {
                    "action": "Portfolio data loaded from database",
                    "timestamp": "2024-01-15T10:00:00Z",
                },
                {"action": "Admin panel accessed", "timestamp": "2024-01-15T10:30:00Z"},
            ],
        }
    )
