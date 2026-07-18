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
        'select u.username, u.id as userID, s.year, s.make, s.model, s.id as saveID from Users u inner join DashboardSaves s on u.id = s.userID where u.id = %s',
        (userID,)
    )
    saves = cursor.fetchall()
    return jsonify(saves)

@dashboard_bp.route("/api/get_shopping_cart", methods=["POST"])
def get_shopping_cart():
    data = request.get_json()
    save_row = data.get('rowID')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        'select s.year, s.make, s.model, c.itemName, c.link, c.saveID from DashboardSaves s inner join cart c on s.id = c.saveID where s.id = %s',
        (save_row,)
    )
    cart_items = cursor.fetchall()
    return jsonify(cart_items)