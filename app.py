from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

SECRET_STRING = "i can rewrite the story."
CORRECT_PASSWORD = "MARVEL-CTF-2025"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.get_json()
    text = data.get("text", "").strip().lower()

    if text == SECRET_STRING:
        return jsonify({"message": f"Correct. Your password is: {CORRECT_PASSWORD}"})
    else:
        return jsonify({"message": "Thank you for your feedback!"})


if __name__ == "__main__":
    app.run(debug=True)
