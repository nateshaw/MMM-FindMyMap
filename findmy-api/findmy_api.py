from flask import Flask, jsonify
from pyicloud import PyiCloudService
import keyring

app = Flask(__name__)

APPLE_ID = keyring.get_password("findmy", "ICLOUD_USER")
APPLE_PW = keyring.get_password("findmy", "ICLOUD_PASS")

if not APPLE_ID or not APPLE_PW:
    raise Exception("Missing Apple ID credentials in keyring.")

api = PyiCloudService(APPLE_ID, APPLE_PW)

if api.requires_2fa:
    print("Two-factor authentication required.")
    code = input("Enter the code you received: ")
    if not api.validate_2fa_code(code):
        raise Exception("2FA authentication failed.")

@app.route("/locations")
def get_locations():
    people = api.friends.people
    locations = []
    for person in people:
        if person.location:
            locations.append({
                "name": person.first_name,
                "lat": person.location["latitude"],
                "lon": person.location["longitude"]
            })
    return jsonify(locations)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
