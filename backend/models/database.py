"""
Database models and initialization for Portfolio Admin Panel
Uses SQLite for data persistence
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "portfolio.db")


class Database:
    """Database manager for portfolio data"""

    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self.init_database()

    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_database(self):
        """Initialize database with tables"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Personal Info Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS personal_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT,
                title TEXT,
                location TEXT,
                status TEXT,
                experience TEXT,
                email TEXT,
                phone TEXT,
                github TEXT,
                linkedin TEXT,
                twitter TEXT,
                portfolio TEXT,
                resume TEXT,
                bio TEXT,
                availability TEXT,
                timezone TEXT,
                languages TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Skills Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                skills_data TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Projects Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                filename TEXT,
                version TEXT,
                downloads TEXT,
                description TEXT,
                technologies TEXT,
                features TEXT,
                stars INTEGER DEFAULT 0,
                forks INTEGER DEFAULT 0,
                demo_url TEXT,
                github_url TEXT,
                status TEXT DEFAULT 'active',
                featured BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Experience Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS experience (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT,
                period TEXT,
                duration TEXT,
                type TEXT,
                description TEXT,
                achievements TEXT,
                technologies TEXT,
                commit_hash TEXT,
                color TEXT,
                badge TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Education Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS education (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                degree TEXT NOT NULL,
                school TEXT NOT NULL,
                location TEXT,
                period TEXT,
                gpa TEXT,
                relevant_courses TEXT,
                achievements TEXT,
                focus TEXT,
                certification TEXT,
                duration TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Certifications Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS certifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                issuer TEXT NOT NULL,
                date TEXT,
                credential TEXT,
                validity TEXT,
                badge TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Achievements Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL UNIQUE,
                data TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Testimonials Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                company TEXT NOT NULL,
                text TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                date TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Blog Posts Table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                excerpt TEXT,
                date TEXT,
                read_time TEXT,
                tags TEXT,
                featured BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        # Contact Messages Table (from portfolio Send Message form)
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

        conn.commit()
        conn.close()

        # Initialize with default data if empty
        self.init_default_data()

    def init_default_data(self):
        """Initialize database with default data from portfolio_data.py"""
        from .portfolio_data import (
            PERSONAL_INFO,
            SKILLS,
            PROJECTS,
            EXPERIENCE,
            TESTIMONIALS,
            BLOG_POSTS,
            ACHIEVEMENTS,
        )

        conn = self.get_connection()
        cursor = conn.cursor()

        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM personal_info")
        if cursor.fetchone()[0] == 0:
            # Insert personal info
            cursor.execute(
                """
                INSERT INTO personal_info (
                    name, role, title, location, status, experience,
                    email, phone, github, linkedin, twitter, portfolio,
                    resume, bio, availability, timezone, languages
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    PERSONAL_INFO.get("name"),
                    PERSONAL_INFO.get("role"),
                    PERSONAL_INFO.get("title"),
                    PERSONAL_INFO.get("location"),
                    PERSONAL_INFO.get("status"),
                    PERSONAL_INFO.get("experience"),
                    PERSONAL_INFO.get("email"),
                    PERSONAL_INFO.get("phone"),
                    PERSONAL_INFO.get("github"),
                    PERSONAL_INFO.get("linkedin"),
                    PERSONAL_INFO.get("twitter"),
                    PERSONAL_INFO.get("portfolio"),
                    PERSONAL_INFO.get("resume"),
                    PERSONAL_INFO.get("bio"),
                    PERSONAL_INFO.get("availability"),
                    PERSONAL_INFO.get("timezone"),
                    json.dumps(PERSONAL_INFO.get("languages", [])),
                ),
            )

        # Check if skills exist
        cursor.execute("SELECT COUNT(*) FROM skills")
        if cursor.fetchone()[0] == 0:
            # Insert skills
            for category, data in SKILLS.items():
                cursor.execute(
                    """
                    INSERT INTO skills (category, title, skills_data)
                    VALUES (?, ?, ?)
                """,
                    (category, data["title"], json.dumps(data["skills"])),
                )

        # Check if projects exist
        cursor.execute("SELECT COUNT(*) FROM projects")
        if cursor.fetchone()[0] == 0:
            # Insert projects
            for project in PROJECTS:
                cursor.execute(
                    """
                    INSERT INTO projects (
                        name, filename, version, downloads, description,
                        technologies, features, stars, forks, demo_url,
                        github_url, status, featured
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                    (
                        project["name"],
                        project.get("filename"),
                        project.get("version"),
                        project.get("downloads"),
                        project["description"],
                        json.dumps(project.get("technologies", [])),
                        json.dumps(project.get("features", [])),
                        project.get("stars", 0),
                        project.get("forks", 0),
                        project.get("demoUrl"),
                        project.get("githubUrl"),
                        project.get("status", "active"),
                        1 if project.get("featured") else 0,
                    ),
                )

        # Check if experience exists
        cursor.execute("SELECT COUNT(*) FROM experience")
        if cursor.fetchone()[0] == 0:
            # Insert experience
            for exp in EXPERIENCE:
                cursor.execute(
                    """
                    INSERT INTO experience (
                        title, company, location, period, duration, type,
                        description, achievements, technologies
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                    (
                        exp["title"],
                        exp["company"],
                        exp.get("location"),
                        exp.get("period"),
                        exp.get("duration"),
                        exp.get("type"),
                        exp["description"],
                        json.dumps(exp.get("achievements", [])),
                        json.dumps(exp.get("technologies", [])),
                    ),
                )

        # Check if testimonials exist
        cursor.execute("SELECT COUNT(*) FROM testimonials")
        if cursor.fetchone()[0] == 0:
            # Insert testimonials
            for testimonial in TESTIMONIALS:
                cursor.execute(
                    """
                    INSERT INTO testimonials (
                        name, role, company, text, rating, date
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                    (
                        testimonial["name"],
                        testimonial["role"],
                        testimonial["company"],
                        testimonial["text"],
                        testimonial.get("rating", 5),
                        testimonial.get("date"),
                    ),
                )

        # Check if achievements exist
        cursor.execute("SELECT COUNT(*) FROM achievements")
        if cursor.fetchone()[0] == 0:
            # Insert achievements
            for category, data in ACHIEVEMENTS.items():
                cursor.execute(
                    """
                    INSERT INTO achievements (category, data)
                    VALUES (?, ?)
                """,
                    (category, json.dumps(data))
                )

        # Check if blog posts exist
        cursor.execute("SELECT COUNT(*) FROM blog_posts")
        if cursor.fetchone()[0] == 0:
            # Insert blog posts
            for post in BLOG_POSTS:
                cursor.execute(
                    """
                    INSERT INTO blog_posts (
                        title, excerpt, date, read_time, tags, featured
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                    (
                        post["title"],
                        post.get("excerpt"),
                        post.get("date"),
                        post.get("readTime"),
                        json.dumps(post.get("tags", [])),
                        1 if post.get("featured") else 0,
                    ),
                )

        conn.commit()
        conn.close()

    # Personal Info Methods
    def get_personal_info(self) -> Dict[str, Any]:
        """Get personal information"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM personal_info ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                "name": row["name"],
                "role": row["role"],
                "title": row["title"],
                "location": row["location"],
                "status": row["status"],
                "experience": row["experience"],
                "email": row["email"],
                "phone": row["phone"],
                "github": row["github"],
                "linkedin": row["linkedin"],
                "twitter": row["twitter"],
                "portfolio": row["portfolio"],
                "resume": row["resume"],
                "bio": row["bio"],
                "availability": row["availability"],
                "timezone": row["timezone"],
                "languages": json.loads(row["languages"]) if row["languages"] else [],
            }
        return {}

    def update_personal_info(self, data: Dict[str, Any]) -> bool:
        """Update personal information"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE personal_info SET
                name = ?, role = ?, title = ?, location = ?, status = ?,
                experience = ?, email = ?, phone = ?, github = ?, linkedin = ?,
                twitter = ?, portfolio = ?, resume = ?, bio = ?, availability = ?,
                timezone = ?, languages = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = (SELECT id FROM personal_info ORDER BY id DESC LIMIT 1)
        """,
            (
                data.get("name"),
                data.get("role"),
                data.get("title"),
                data.get("location"),
                data.get("status"),
                data.get("experience"),
                data.get("email"),
                data.get("phone"),
                data.get("github"),
                data.get("linkedin"),
                data.get("twitter"),
                data.get("portfolio"),
                data.get("resume"),
                data.get("bio"),
                data.get("availability"),
                data.get("timezone"),
                json.dumps(data.get("languages", [])),
            ),
        )

        conn.commit()
        conn.close()
        return True

    # Skills Methods
    def get_skills(self) -> Dict[str, Any]:
        """Get all skills"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM skills")
        rows = cursor.fetchall()
        conn.close()

        skills = {}
        for row in rows:
            skills[row["category"]] = {
                "title": row["title"],
                "skills": json.loads(row["skills_data"]),
            }
        return skills

    def update_skills_category(self, category: str, data: Dict[str, Any]) -> bool:
        """Update or create skills category"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Check if category exists
        cursor.execute("SELECT id FROM skills WHERE category = ?", (category,))
        row = cursor.fetchone()

        if row:
            cursor.execute(
                """
                UPDATE skills SET
                    title = ?, skills_data = ?, updated_at = CURRENT_TIMESTAMP
                WHERE category = ?
            """,
                (data["title"], json.dumps(data["skills"]), category),
            )
        else:
            cursor.execute(
                """
                INSERT INTO skills (category, title, skills_data)
                VALUES (?, ?, ?)
            """,
                (category, data["title"], json.dumps(data["skills"])),
            )

        conn.commit()
        conn.close()
        return True

    # Projects Methods
    def get_projects(self) -> List[Dict[str, Any]]:
        """Get all projects"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        projects = []
        for row in rows:
            projects.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "filename": row["filename"],
                    "version": row["version"],
                    "downloads": row["downloads"],
                    "description": row["description"],
                    "technologies": (
                        json.loads(row["technologies"]) if row["technologies"] else []
                    ),
                    "features": json.loads(row["features"]) if row["features"] else [],
                    "stars": row["stars"],
                    "forks": row["forks"],
                    "demoUrl": row["demo_url"],
                    "githubUrl": row["github_url"],
                    "status": row["status"],
                    "featured": bool(row["featured"]),
                }
            )
        return projects

    def add_project(self, data: Dict[str, Any]) -> int:
        """Add new project"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO projects (
                name, filename, version, downloads, description,
                technologies, features, stars, forks, demo_url,
                github_url, status, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                data["name"],
                data.get("filename"),
                data.get("version"),
                data.get("downloads"),
                data["description"],
                json.dumps(data.get("technologies", [])),
                json.dumps(data.get("features", [])),
                data.get("stars", 0),
                data.get("forks", 0),
                data.get("demoUrl"),
                data.get("githubUrl"),
                data.get("status", "active"),
                1 if data.get("featured") else 0,
            ),
        )

        project_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return project_id

    def update_project(self, project_id: int, data: Dict[str, Any]) -> bool:
        """Update project"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE projects SET
                name = ?, filename = ?, version = ?, downloads = ?,
                description = ?, technologies = ?, features = ?,
                stars = ?, forks = ?, demo_url = ?, github_url = ?,
                status = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """,
            (
                data.get("name"),
                data.get("filename"),
                data.get("version"),
                data.get("downloads"),
                data.get("description"),
                json.dumps(data.get("technologies", [])),
                json.dumps(data.get("features", [])),
                data.get("stars", 0),
                data.get("forks", 0),
                data.get("demoUrl"),
                data.get("githubUrl"),
                data.get("status"),
                1 if data.get("featured") else 0,
                project_id,
            ),
        )

        conn.commit()
        conn.close()
        return True

    def delete_project(self, project_id: int) -> bool:
        """Delete project"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        conn.commit()
        conn.close()
        return True

    # Experience Methods
    def get_experience(self) -> List[Dict[str, Any]]:
        """Get all experience"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM experience ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        experience = []
        for row in rows:
            experience.append(
                {
                    "id": row["id"],
                    "title": row["title"],
                    "company": row["company"],
                    "location": row["location"],
                    "period": row["period"],
                    "duration": row["duration"],
                    "type": row["type"],
                    "description": row["description"],
                    "achievements": (
                        json.loads(row["achievements"]) if row["achievements"] else []
                    ),
                    "technologies": (
                        json.loads(row["technologies"]) if row["technologies"] else []
                    ),
                    "commit": row["commit_hash"] if "commit_hash" in row.keys() else None,
                    "color": row["color"] if "color" in row.keys() else None,
                    "badge": row["badge"] if "badge" in row.keys() else None,
                }
            )
        return experience

    def add_experience(self, data: Dict[str, Any]) -> int:
        """Add new experience"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO experience (
                title, company, location, period, duration, type,
                description, achievements, technologies, commit_hash, color, badge
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                data["title"],
                data["company"],
                data.get("location"),
                data.get("period"),
                data.get("duration"),
                data.get("type"),
                data["description"],
                json.dumps(data.get("achievements", [])),
                json.dumps(data.get("technologies", [])),
                data.get("commit"),
                data.get("color"),
                data.get("badge"),
            ),
        )

        exp_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return exp_id

    def update_experience(self, exp_id: int, data: Dict[str, Any]) -> bool:
        """Update experience"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE experience SET
                title = COALESCE(?, title), 
                company = COALESCE(?, company), 
                location = COALESCE(?, location),
                period = COALESCE(?, period),
                duration = COALESCE(?, duration),
                type = COALESCE(?, type),
                description = COALESCE(?, description),
                achievements = COALESCE(?, achievements),
                technologies = COALESCE(?, technologies),
                commit_hash = COALESCE(?, commit_hash),
                color = COALESCE(?, color),
                badge = COALESCE(?, badge),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """,
            (
                data.get("title"),
                data.get("company"),
                data.get("location"),
                data.get("period"),
                data.get("duration"),
                data.get("type"),
                data.get("description"),
                json.dumps(data.get("achievements"))
                if data.get("achievements") is not None
                else None,
                json.dumps(data.get("technologies"))
                if data.get("technologies") is not None
                else None,
                data.get("commit"),
                data.get("color"),
                data.get("badge"),
                exp_id,
            ),
        )

        conn.commit()
        conn.close()
        return True

    def delete_experience(self, exp_id: int) -> bool:
        """Delete experience"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM experience WHERE id = ?", (exp_id,))
        conn.commit()
        conn.close()
        return True

    # Education Methods
    def get_education(self) -> List[Dict[str, Any]]:
        """Get all education"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM education ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        education = []
        for row in rows:
            education.append(
                {
                    "id": row["id"],
                    "degree": row["degree"],
                    "school": row["school"],
                    "location": row["location"],
                    "period": row["period"],
                    "gpa": row["gpa"],
                    "relevant_courses": (
                        json.loads(row["relevant_courses"])
                        if row["relevant_courses"]
                        else []
                    ),
                    "achievements": (
                        json.loads(row["achievements"]) if row["achievements"] else []
                    ),
                    "focus": row["focus"],
                    "certification": row["certification"],
                    "duration": row["duration"],
                }
            )
        return education

    def add_education(self, data: Dict[str, Any]) -> int:
        """Add new education"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO education (
                degree, school, location, period, gpa,
                relevant_courses, achievements, focus, certification, duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                data["degree"],
                data["school"],
                data.get("location"),
                data.get("period"),
                data.get("gpa"),
                json.dumps(data.get("relevant_courses", [])),
                json.dumps(data.get("achievements", [])),
                data.get("focus"),
                data.get("certification"),
                data.get("duration"),
            ),
        )

        edu_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return edu_id

    def update_education(self, edu_id: int, data: Dict[str, Any]) -> bool:
        """Update education"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE education SET
                degree = COALESCE(?, degree),
                school = COALESCE(?, school),
                location = COALESCE(?, location),
                period = COALESCE(?, period),
                gpa = COALESCE(?, gpa),
                relevant_courses = COALESCE(?, relevant_courses),
                achievements = COALESCE(?, achievements),
                focus = COALESCE(?, focus),
                certification = COALESCE(?, certification),
                duration = COALESCE(?, duration),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """,
            (
                data.get("degree"),
                data.get("school"),
                data.get("location"),
                data.get("period"),
                data.get("gpa"),
                json.dumps(data.get("relevant_courses"))
                if data.get("relevant_courses") is not None
                else None,
                json.dumps(data.get("achievements"))
                if data.get("achievements") is not None
                else None,
                data.get("focus"),
                data.get("certification"),
                data.get("duration"),
                edu_id,
            ),
        )

        conn.commit()
        conn.close()
        return True

    def delete_education(self, edu_id: int) -> bool:
        """Delete education"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM education WHERE id = ?", (edu_id,))
        conn.commit()
        conn.close()
        return True

    # Certifications Methods
    def get_certifications(self) -> List[Dict[str, Any]]:
        """Get all certifications"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM certifications ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        certifications = []
        for row in rows:
            certifications.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "issuer": row["issuer"],
                    "date": row["date"],
                    "credential": row["credential"],
                    "validity": row["validity"],
                    "badge": row["badge"],
                }
            )
        return certifications

    def add_certification(self, data: Dict[str, Any]) -> int:
        """Add new certification"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO certifications (
                name, issuer, date, credential, validity, badge
            ) VALUES (?, ?, ?, ?, ?, ?)
        """,
            (
                data["name"],
                data["issuer"],
                data.get("date"),
                data.get("credential"),
                data.get("validity"),
                data.get("badge"),
            ),
        )

        cert_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return cert_id

    def update_certification(self, cert_id: int, data: Dict[str, Any]) -> bool:
        """Update certification"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE certifications SET
                name = COALESCE(?, name),
                issuer = COALESCE(?, issuer),
                date = COALESCE(?, date),
                credential = COALESCE(?, credential),
                validity = COALESCE(?, validity),
                badge = COALESCE(?, badge),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """,
            (
                data.get("name"),
                data.get("issuer"),
                data.get("date"),
                data.get("credential"),
                data.get("validity"),
                data.get("badge"),
                cert_id,
            ),
        )

        conn.commit()
        conn.close()
        return True

    def delete_certification(self, cert_id: int) -> bool:
        """Delete certification"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM certifications WHERE id = ?", (cert_id,))
        conn.commit()
        conn.close()
        return True

    # Achievements Methods
    def get_achievements(self) -> Dict[str, Any]:
        """Get achievements (stats and highlights)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT category, data FROM achievements")
        rows = cursor.fetchall()
        conn.close()

        achievements = {"stats": {}, "highlights": []}
        for row in rows:
            category = row["category"]
            data = json.loads(row["data"])
            if category == "stats":
                achievements["stats"] = data
            elif category == "highlights":
                achievements["highlights"] = data
        
        return achievements

    def update_achievements(self, category: str, data: Any) -> bool:
        """Update achievements category"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Check if category exists
        cursor.execute("SELECT id FROM achievements WHERE category = ?", (category,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute(
                "UPDATE achievements SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE category = ?",
                (json.dumps(data), category)
            )
        else:
            cursor.execute(
                "INSERT INTO achievements (category, data) VALUES (?, ?)",
                (category, json.dumps(data))
            )

        conn.commit()
        conn.close()
        return True

    # Testimonials Methods
    def get_testimonials(self) -> List[Dict[str, Any]]:
        """Get all testimonials"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM testimonials ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        testimonials = []
        for row in rows:
            testimonials.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "role": row["role"],
                    "company": row["company"],
                    "text": row["text"],
                    "rating": row["rating"],
                    "date": row["date"],
                }
            )
        return testimonials

    def add_testimonial(self, data: Dict[str, Any]) -> int:
        """Add new testimonial"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO testimonials (name, role, company, text, rating, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            (
                data["name"],
                data["role"],
                data["company"],
                data["text"],
                data.get("rating", 5),
                data.get("date"),
            ),
        )

        testimonial_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return testimonial_id

    def update_testimonial(self, testimonial_id: int, data: Dict[str, Any]) -> bool:
        """Update testimonial"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE testimonials SET
                name = ?, role = ?, company = ?, text = ?,
                rating = ?, date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """,
            (
                data.get("name"),
                data.get("role"),
                data.get("company"),
                data.get("text"),
                data.get("rating", 5),
                data.get("date"),
                testimonial_id,
            ),
        )

        conn.commit()
        conn.close()
        return True

    def delete_testimonial(self, testimonial_id: int) -> bool:
        """Delete testimonial"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM testimonials WHERE id = ?", (testimonial_id,))
        conn.commit()
        conn.close()
        return True

    # Blog Posts Methods
    def get_blog_posts(self) -> List[Dict[str, Any]]:
        """Get all blog posts"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM blog_posts ORDER BY date DESC")
        rows = cursor.fetchall()
        conn.close()

        posts = []
        for row in rows:
            posts.append(
                {
                    "id": row["id"],
                    "title": row["title"],
                    "excerpt": row["excerpt"],
                    "date": row["date"],
                    "readTime": row["read_time"],
                    "tags": json.loads(row["tags"]) if row["tags"] else [],
                    "featured": bool(row["featured"]),
                }
            )
        return posts

    def add_blog_post(self, data: Dict[str, Any]) -> int:
        """Add new blog post"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO blog_posts (title, excerpt, date, read_time, tags, featured)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            (
                data["title"],
                data.get("excerpt"),
                data.get("date"),
                data.get("readTime"),
                json.dumps(data.get("tags", [])),
                1 if data.get("featured") else 0,
            ),
        )

        post_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return post_id

    def update_blog_post(self, post_id: int, data: Dict[str, Any]) -> bool:
        """Update blog post"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE blog_posts SET
                title = ?, excerpt = ?, date = ?, read_time = ?,
                tags = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """,
            (
                data.get("title"),
                data.get("excerpt"),
                data.get("date"),
                data.get("readTime"),
                json.dumps(data.get("tags", [])),
                1 if data.get("featured") else 0,
                post_id,
            ),
        )

        conn.commit()
        conn.close()
        return True

    def delete_blog_post(self, post_id: int) -> bool:
        """Delete blog post"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
        conn.commit()
        conn.close()
        return True

    # Contact Messages Methods (from portfolio Send Message form)
    def add_contact_message(self, name: str, email: str, subject: str, message: str) -> int:
        """Save a contact form submission"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        """,
            (name, email, subject or "", message),
        )
        msg_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return msg_id

    def get_contact_messages(self) -> List[Dict[str, Any]]:
        """Get all contact form submissions (newest first)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC"
        )
        rows = cursor.fetchall()
        conn.close()
        return [
            {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "subject": row["subject"] or "",
                "message": row["message"],
                "created_at": row["created_at"],
            }
            for row in rows
        ]

    def delete_contact_message(self, message_id: int) -> bool:
        """Delete a contact message"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM contact_messages WHERE id = ?", (message_id,))
        conn.commit()
        conn.close()
        return True


# Global database instance
db = Database()
