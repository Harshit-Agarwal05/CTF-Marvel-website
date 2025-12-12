import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# SECRET_STRING must be set in environment (Render env var). Default is empty to avoid accidental exposure.
SECRET_STRING = os.getenv("SECRET_STRING", "").strip().lower()

# Exact multiline success message (as you requested)
SUCCESS_MESSAGE = (
    "congrats you finally got it:\n"
    "here is the password of see.zip: I saw the end of time\n"
    "\"Make sure you listen with your eyes and use tools provided\""
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/feedback", methods=["POST"])
def feedback():
    try:
        data = request.get_json() or {}
    except Exception:
        data = {}
    user_text = (data.get("text") or "").strip().lower()

    if SECRET_STRING and user_text == SECRET_STRING:
        # return EXACT multiline message
        return jsonify({"message": SUCCESS_MESSAGE})
    else:
        return jsonify({"message": "Thank you for your feedback!"})

@app.route("/favourite", methods=["POST"])
def favourite():
    try:
        data = request.get_json() or {}
    except Exception:
        data = {}
    name = (data.get("name") or "").strip().lower()
    if name == "loki":
        return jsonify({"message": "Good going, on the right track"})
    else:
        return jsonify({"message": "No relevant match found."})

if __name__ == "__main__":
    # debug True for local testing (turn off in production if desired)
    app.run(debug=True)
