from flask import Flask
from flask import render_template
from flask import url_for
from flask import session, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = "really-random"
app.config["SQLALCHEMY_DATABASE_URI"] = "DATABASE_URL"
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()



@app.route("/")
@app.route("/home")
def home(name=None):
    return render_template('index.html', user=session.get("user"))


@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session["user"] = username
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    return render_template('login.html')

@app.route("/login/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "username already taken"}), 400
        
        password_hash = generate_password_hash(password)
        new_user = User(username=username, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": True})
    return render_template('register.html')

@app.route("/logout/api")
def logout():
    session.pop("user", None)
    return redirect(url_for("home"))