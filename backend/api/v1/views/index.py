#!/usr/bin/env python3
"""Index
"""
from api.v1.views import app_views
from flask import jsonify, make_response, render_template, send_from_directory, current_app
from werkzeug.utils import secure_filename

@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """Status of the API
    """
    return make_response(jsonify({"status": "OK"}), 200)

@app_views.route('/', methods=['GET'], strict_slashes=False)
def home():
    """Default landing page
    """
    desc = ["Cofounder", "Software Engineer", "Telecomunication Engineer"]
    projects = [
        {
            "title": "GrooveJam",
            "description": "A lightweight, high-performance music player built in C, designed to deliver a seamless and immersive audio experience.",
            "image": "/static/images/png/logo-white.png"
        },
        {
            "title": "VibeLink",
            "description": "A real-time communication platform for chat and video conferencing, with features like message synchronization and presence indicators.",
            "image": "/static/images/png/logo-white.png"
        },
        {
            "title": "Etims Compliance Integration",
            "description": "An automated system to integrate with the KRA platform for seamless sales transmission and compliance.",
            "image": "/static/images/png/logo-white.png"
        }
    ]
    
    skills=[]
    # skills = [
    #     {
    #         "title": "React Virtuoso",
    #         "description": "Crafting responsive and performant web applications with React's cutting-edge capabilities.",
    #         "icon": """<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
    #                    <line x1="12" y1="22" x2="12" y2="15.5" />
    #                    <polyline points="22 8.5 12 15.5 2 8.5" />
    #                    <polyline points="2 15.5 12 8.5 22 15.5" />
    #                    <line x1="12" y1="2" x2="12" y2="8.5" />""",
    #     },
    #     {
    #         "title": "Node.js Maestro",
    #         "description": "Designing and implementing scalable and efficient server-side applications with the power of Node.js.",
    #         "icon": """<ellipse cx="12" cy="5" rx="9" ry="3" />
    #                    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    #                    <path d="M3 12A9 3 0 0 0 21 12" />""",
    #     },
    #     {
    #         "title": "MongoDB Maverick",
    #         "description": "Mastering the art of NoSQL database design and implementation with the flexibility of MongoDB.",
    #         "icon": """<path d="M2 8h20" />
    #                    <rect width="20" height="16" x="2" y="4" rx="2" />
    #                    <path d="M6 16h12" />""",
    #     },
    #     {
    #         "title": "Docker Virtuoso",
    #         "description": "Expertly containerizing and deploying applications with the power of Docker, ensuring seamless scalability.",
    #         "icon": """<path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" />""",
    #     },
    # ]
    
    socials = [
        {
            "name": "LinkedIn",
            "icon": "images/svg/linkedin-color.svg",
            "url": "https://www.linkedin.com/in/kinyara-samuel-gachigo-885b151a5"
        },
        {
            "name": "GitHub",
            "icon": "images/svg/github.svg",
            "url": "https://github.com/kinyarasam"
        },
        {
            "name": "Instagram",
            "icon": "images/svg/instagram.svg",
            "url": "https://www.instagram.com/kinyarasam"
        },
        {
            "name": "Gmail",
            "icon": "images/svg/gmail-color.svg",
            "url": "mailto:skinyara.30@gmail.com"
        }
    ]

    return render_template('portfolio.html',
        name="Kinyara Samuel Gachigo",
        tagline="Innovating Tomorrow, Today.",
        description=" | ".join(desc),
        skills=skills,
        projects=projects,
        socials=socials)
    
@app_views.route('/cv/resume/download', methods=['GET'], strict_slashes=False)
def resume():
    print("hit")
    try:
        # Assuming the PDF is stored in the 'static/cv' directory of your Flask application
        # Using `secure_filename` to ensure the file name is safe to use with the filesystem
        filename = secure_filename('resume.pdf')
        return send_from_directory(current_app.static_folder + '/files/', filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "Resume not found"}), 404