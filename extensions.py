from functools import wraps
from flask import session, redirect, url_for, jsonify
from flask_mysqldb import MySQL

mysql = MySQL()

def role_required(role):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if not session.get('loggedin'):
                return redirect(url_for('login'))
            if session.get('role') != role:
                return jsonify({"error": "Forbidden"}), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator