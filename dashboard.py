from flask import Blueprint, jsonify
from app import mysql
import MySQLdb.cursors

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/api/get_dashboard_saves_from_db", methods=["GET"])
def get_dashboard_saves_from_db():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        'select'
    )