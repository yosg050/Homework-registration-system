import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

app = Flask(__name__)
client = MongoClient(os.getenv("DATABASE_URL"), tls=True, tlsAllowInvalidCertificates=True)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.route("/")
def home():
    return "Hello World!"


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )
