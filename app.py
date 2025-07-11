
from flask import Flask, render_template
import json, os
app = Flask(__name__)

@app.route("/")
def home():
    with open(os.path.join(os.path.dirname(__file__), "data.json")) as f:
        data = json.load(f)
    return render_template("index.html", data=data)

if __name__ == "__main__":
    app.run(debug=True)

