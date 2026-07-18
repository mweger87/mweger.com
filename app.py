from flask import Flask
from flask import render_template
from flask import url_for
from flask import session, redirect, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re 


load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ['SECRET_KEY']
app.config['MYSQL_HOST'] = os.environ['MYSQL_HOST'] 
app.config['MYSQL_USER'] = os.environ['MYSQL_USER']
app.config['MYSQL_PASSWORD'] = os.environ['MYSQL_PASSWORD']
app.config['MYSQL_DB'] = os.environ['MYSQL_DB']
mysql = MySQL(app)

from projects import projects_bp
app.register_blueprint(projects_bp)




@app.route("/")
@app.route("/home")
def home():
    return render_template('index.html', user=session.get("username"))

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/projects")
def projects():
    return render_template('projects.html')

@app.route("/rebuild-dashboard")
def rebuild_dashboard():
    return render_template('rebuildDashboard.html', user=session.get("username"), userID=session.get("id"))

@app.route("/api/render_dashboard")
def render_dashboard():
    year = request.args.get('year')
    make = request.args.get('make')
    model = request.args.get('model')
    return render_template('dashboard_files/dashboard_content.html', year=year, make=make, model=model)

@app.route("/api/render_dashboard_start_form")
def render_dashboard_start_from():
    return render_template('dashboard_files/dashboard_start_form.html')

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            'SELECT * FROM Users where username = %s', (username, )
        )
        account = cursor.fetchone()
        if account and check_password_hash(account['password'], password):
            session['loggedin'] = True
            session['id'] = account['id']
            session['username'] = account['username']
            msg = 'Log in success'
            return jsonify({"success": True})
        else:
            msg = 'Log in failed'
            return jsonify({"error": "Log in failed"}), 401
    return render_template('login.html')

@app.route("/register", methods=["GET", "POST"])
def register():
    msg = ''
    
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        hashed_password = generate_password_hash(password)

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        cursor.execute(
            'SELECT * FROM Users WHERE username = %s',
            (username,)
        )
        account_username = cursor.fetchone()

        cursor.execute(
            'SELECT * FROM Users WHERE email = %s',
            (email, )
        )
        account_email = cursor.fetchone()

        if account_username:
            msg = 'Username already exists'
        elif account_email:
            msg = 'Email already used'
        elif not re.match(
                r'[^@]+@[^@]+\.[^@]+',
                email):
            msg = 'Inavlid email'
        elif not re.match(
                r'[A-Za-z0-9]+',
                username):
            msg = 'Username must contain only letters and numbers'
        
        else:
            cursor.execute(
                '''INSERT INTO Users (username, email, password, role)
                VALUES ( %s, %s, %s, %s)''',
                (
                    username,
                    email,
                    hashed_password,
                    'user'
                )
            )

            mysql.connection.commit()
            msg = 'Regsiter success'
    
    elif request.method == 'POST':
        msg = 'Fill out the form'

    return render_template(
        'register.html',
        msg=msg
    )
    
@app.route("/logout")
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for("home"))