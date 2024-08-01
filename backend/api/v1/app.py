#!/usr/bin/env python3
"""Flask application
"""
from flask import Flask
from api.v1.views import app_views


app = Flask(__name__)
app.register_blueprint(app_views)


if __name__ == "__main__":
    """Main Entry point
    """
    app.run(debug=True)
