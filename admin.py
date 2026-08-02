from flask import Blueprint, jsonify, request, render_template
from extensions import mysql, role_required
import MySQLdb.cursors

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/api/save-project", methods=["POST"])
@role_required('admin')
def save_project():
    data = request.get_json()
    id = data.get('id')
    title = data.get('title')
    description = data.get('description')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    try: 
        cursor.execute(
            'update Projects set title = %s, description = %s where id = %s ',
            (title, description, id)
        )
        mysql.connection.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
@admin_bp.route("/api/save-link", methods=["POST"])
@role_required('admin')
def save_link():
    data = request.get_json()
    id = data.get('id')
    name = data.get('name')
    url = data.get('url')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    try:
        cursor.execute(
            'update ProjectLinks set linkName = %s, link = %s where id = %s',
            (name, url, id)
        )
        mysql.connection.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500