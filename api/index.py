import os
import sys

# Ensure ML package is importable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, '..'))
ML_DIR = os.path.join(REPO_ROOT, 'ML')
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

from app import app as flask_app  # ML/app.py exposes Flask app
from vercel_wsgi import handle

# Vercel entrypoint
handler = handle(flask_app)


