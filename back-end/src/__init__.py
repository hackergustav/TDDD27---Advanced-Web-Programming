from flask_cors import CORS
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from src.config import Config
from .auth import AuthError


# creating the Flask application
app = Flask(__name__)
# config the app from the config object
app.config.from_object(Config)
# set up CORS
CORS(app)
# Create database binding
db = SQLAlchemy(app)


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


# comment out everything below before running init_db.py
# put here to avoid circular dependencies
from src.api_helpers import setup_ext_token
# set up the token used to access our auth0 endpoints as well as when said token is to expire
TOKEN, TOKEN_EXP = setup_ext_token()

from src import routes

