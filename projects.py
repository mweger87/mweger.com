from flask import Blueprint, jsonify
from app import mysql
import MySQLdb.cursors 

projects_bp = Blueprint('projects', __name__)

@projects_bp.route("/api/get_projects_from_db", methods=["GET"])
def get_projects_from_db():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        'select p.id, p.title, p.description, l.link, l.projectID from Projects p inner join ProjectLinks l on p.id = l.projectID'
    )
    projects = cursor.fetchall()
    return jsonify(projects)