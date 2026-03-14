# Portfolio Flask Backend

Flask backend API for the React portfolio website.

## Features

- RESTful API endpoints for portfolio data
- Contact form handling with email notifications
- CORS enabled for frontend integration
- Environment-based configuration
- Error handling and validation

## API Endpoints

### GET Endpoints
- `GET /` - API information and available endpoints
- `GET /api/health` - Health check
- `GET /api/personal-info` - Personal information
- `GET /api/skills` - All skills data
- `GET /api/skills/<category>` - Skills by category (frontend, backend, database, cloud)
- `GET /api/projects` - All projects (add `?featured=true` for featured only)
- `GET /api/projects/<id>` - Specific project by ID
- `GET /api/experience` - Work experience
- `GET /api/testimonials` - Testimonials
- `GET /api/blog` - Blog posts (add `?featured=true` for featured only)
- `GET /api/stats` - Portfolio statistics

### POST Endpoints
- `POST /api/contact` - Contact form submission

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Contact Form

Send POST request to `/api/contact` with JSON body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss a project..."
}
```

## Deployment

For production deployment with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```