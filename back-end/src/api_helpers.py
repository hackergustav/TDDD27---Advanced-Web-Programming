from src.models import ExtToken
from time import time
from src import db
import requests

EXT_DOMAIN = 'collabify.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api'
AUTH0_DOMAIN = 'collabify.eu.auth0.com'
CLIENT_ID = 'mHBropsuFPAHBaSJpahfeXbBIVteAh2X'
CLIENT_SECRET = 'o4yIuS5Nduh8vH18uixVZfcxfbAb1uEhZ-if2syqbby87ClaiwhGlA_1xD7iLmvb'
GRANT_TYPE = 'client_credentials'
API_AUDIENCE_EXT = 'urn:auth0-authz-api'


# gets a token for the api extension from auth0
def get_ext_token():
    payload =f"grant_type={GRANT_TYPE}&client_id={CLIENT_ID}" \
             f"&client_secret={CLIENT_SECRET}&audience=urn:auth0-authz-api"
    resp = requests.post(f'https://{AUTH0_DOMAIN}/oauth/token', payload, headers={'content-type':
                                                                                  "application/x-www-form-urlencoded"})

    return resp.json()


# initial setup for token for auth0 extension api, returns the token and its time of expiry
def setup_ext_token():
    # gets the latest token from database if there is one
    token = ExtToken.query.order_by(ExtToken.exp_at.desc()).first()
    # checking if there is a token in the database or if the latest token in the database has expired
    if (token is None) or (token.exp_at < int(time())):
        print('getting new token')
        temp = get_ext_token()
        now = int(time())
        token = ExtToken(token=temp['access_token'], exp_at=(now+temp['expires_in']))
        db.session.add(token)
        db.session.commit()

    return token.token, token.exp_at
