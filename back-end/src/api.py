import requests
from src import TOKEN

EXT_DOMAIN = 'collabify.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api'
CLIENT_ID = 'mHBropsuFPAHBaSJpahfeXbBIVteAh2X'
CLIENT_SECRET = 'o4yIuS5Nduh8vH18uixVZfcxfbAb1uEhZ-if2syqbby87ClaiwhGlA_1xD7iLmvb'
GRANT_TYPE = 'client_credentials'
API_AUDIENCE_EXT = 'urn:auth0-authz-api'

# These functions are bindings to the Auth0 extensions API, please refer to their official documentation for
# specifications of endpoints.


def get_users_groups(user_id):
    resp = requests.get(f'https://{EXT_DOMAIN}/users/{user_id}/groups', headers={'authorization': f"Bearer {TOKEN}"})
    return resp.json()


def create_group(name, desc, user):
    resp = requests.post(f'https://{EXT_DOMAIN}/groups', {"name": name, "description": f"{desc}"},
                         headers={'authorization': f"Bearer {TOKEN}"})
    resp_json = resp.json()
    add_member(resp_json["_id"], user)


def check_if_user_in_group(user, group):
    group_members = get_group_members(group)
    for u in group_members['users']:
        if u['user_id'] == user:
            return True
    return False


def get_group_members(_id):
    resp = requests.get(f'https://{EXT_DOMAIN}/groups/{_id}/members',
                         headers={'authorization': f"Bearer {TOKEN}"})
    return resp.json()


# Not used in current version but should be utilised in future
def delete_group(_id):
    requests.delete(f'https://{EXT_DOMAIN}/groups/{_id}',
                    headers={'authorization': f"Bearer {TOKEN}"})


def add_member(group, member):
    data = member
    resp = requests.patch(f'https://{EXT_DOMAIN}/groups/{group}/members', json=[data], headers={'authorization': f"Bearer {TOKEN}"})

