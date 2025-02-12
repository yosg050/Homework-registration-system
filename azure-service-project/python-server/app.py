import os
import requests
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)
client = MongoClient(
    os.getenv("DATABASE_URL"), tls=True, tlsAllowInvalidCertificates=True
)
db = client["registration-system-HW"]
users_collection = db["users"]
nodejs_url = os.getenv("NODEJS_URL")
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

        if users_collection.find_one({"email": email}):
            print("Email already exists")
            return jsonify({"error": "Email already exists"}), 400

        new_user = users_collection.insert_one({"email": email, "password": password})

        response = requests.get(f"http://{nodejs_url}")

        if new_user and new_user.acknowledged == True:
            try:
  
                if response.status_code == 200:
                    nodejs_response = response.json()
                    print("Response from Node.js:")
                    return (
                        jsonify(
                            {
                                "message": "User created successfully",
                                "sentence": nodejs_response["sentence"],
                            }
                        ),
                        200,
                    )
                else:
                    print("Failed to get response from Node.js:")
                    message = "Error connecting to Node.js"
                    return (
                        jsonify(
                            {
                                "message": "User created successfully",
                                "sentence": message,
                            }
                        ),
                        200,
                    )

            except Exception as e:
                print("Error connecting to Node.js:", str(e))
                return (
                    jsonify(
                        {"message": "User created successfully, but error occurred"}
                    ),
                    200,
                )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            print("Email and password are required")
            return jsonify({"error": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})

        if not user:
            print("User not found")
            return jsonify({"error": "User not found"}), 404

        if user["password"] != password:
            print("Invalid password")
            return jsonify({"error": "Invalid credentials"}), 401

        response = requests.get(f"http://{nodejs_url}")

        try:
            if response.status_code == 200:
                nodejs_response = response.json()
                return (
                    jsonify(
                        {
                            "message": "Login successful",
                            "sentence": nodejs_response["sentence"],
                        }
                    ),
                    200,
                )
            else:
                return (
                    jsonify(
                        {
                            "message": "Login successful",
                            "sentence": "Error connecting to Node.js",
                        }
                    ),
                    200,
                )

        except Exception as e:
            print("Error connecting to Node.js:", str(e))
            return jsonify({"message": "Login successful, but error occurred"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True,
    )
