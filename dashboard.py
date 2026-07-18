from flask import Blueprint, jsonify, request, render_template
from app import mysql
import MySQLdb.cursors

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/api/get_dashboard_saves_from_db", methods=["POST"])
def get_dashboard_saves_from_db():
    data = request.get_json()
    userID = data.get('userID')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        'select u.username, u.id, s.year, s.make, s.model from Users u inner join DashboardSaves s on u.id = s.userID where u.id = %s',
        (userID,)
    )
    saves = cursor.fetchall()
    return jsonify(saves)


@dashboard_bp.route("/api/render_dashboard", methods=["POST"])
def render_dashboard():
    data = request.get_json()

    year = data.get('year')
    make = data.get('make')
    model = data.get('model')
    return render_template('dashboard_files/dashboard_content.html', year=year, make=make, model=model)