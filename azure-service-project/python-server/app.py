import os
import requests
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)
client = MongoClient(
    os.getenv("DATABASE_URL"), tls=True, tlsAllowInvalidCertificates=True
)
db = client["registration-system-HW"]
users_collection = db["users"]

try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            print("Email and password are required")
            return jsonify({"error": "Email and password are required"}), 400

        # if users_collection.find_one({"email": email}):
        #     print("Email already exists")
        #     return jsonify({"error": "Email already exists"}), 400

        new_user = users_collection.insert_one({"email": email, "password": password})
        if new_user and new_user.acknowledged == True:
            try:
                nodejs_url = "localhost:5000/getMessage"
                response = requests.get(f"http://{nodejs_url}")
                if response.status_code == 200:
                    nodejs_response = response.json()
                    print("Response from Node.js:", nodejs_response)
                    return jsonify({"message": "User created successfully", "sentence": nodejs_response["sentence"]}), 200
                else:
                    print("Failed to get response from Node.js:", response.status_code)
                    return jsonify({"message": "User created successfully, but failed to get sentence"}), 200

            except Exception as e:
                print("Error connecting to Node.js:", str(e))
                return jsonify({"message": "User created successfully, but error occurred"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True,
    )
