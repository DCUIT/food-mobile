from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3, json
import os
from flask_jwt_extended import *
from functools import wraps
from datetime import timedelta

app = Flask(__name__)
CORS(app, origins="*")

app.config["JWT_SECRET_KEY"] = "secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

# Database path - absolute
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

def admin_required(f):
    @jwt_required()
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        if str(user_id) != "1":
            return jsonify({"msg": "Admin only"}), 403
        return f(*args, **kwargs)
    return decorated

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def home():
    return "Flutter Food API OK"

# Initialize DB
@app.route("/init", methods=["POST"])
def init_db():
    db = get_db()
    db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
        CREATE TABLE IF NOT EXISTS foods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            image TEXT DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            items TEXT,
            status TEXT DEFAULT 'pending'
        );
    """)
    
    # Insert admin & demo foods
    db.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('admin', '123')", ())
    demo_foods = [
        ("Phở Bò", 45000, ""),
        ("Bún Chả", 35000, ""),
        ("Bánh Mì", 25000, ""),
        ("Cơm Tấm", 40000, "")
    ]
    db.executemany("INSERT OR IGNORE INTO foods (name, price, image) VALUES (?, ?, ?)", demo_foods)
    
    db.commit()
    return jsonify({"msg": "DB initialized, admin/123 ready!"})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    db = get_db()
    existing = db.execute("SELECT * FROM users WHERE username=?", (data["username"],)).fetchone()
    if existing:
        return jsonify({"msg": "Username exists"}), 400
    db.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
              (data["username"], data["password"]))
    db.commit()
    return jsonify({"msg": "Đăng ký OK"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username=? AND password=?", 
                     (data["username"], data["password"])).fetchone()
    if user:
        token = create_access_token(identity=str(user["id"]), additional_claims={"username": user["username"]})
        return jsonify(access_token=token, username=user["username"])
    return jsonify({"msg": "Sai tài khoản"}), 401

@app.route("/foods")
def foods():
    db = get_db()
    data = db.execute("SELECT * FROM foods").fetchall()
    return jsonify([dict(f) for f in data])

@app.route("/foods", methods=["POST"])
@jwt_required()
def add_food():
    if get_jwt_identity() != "1": 
        return jsonify({"msg": "Admin only"}), 403
    data = request.json
    db = get_db()
    db.execute("INSERT INTO foods (name, price, image) VALUES (?, ?, ?)", 
              (data["name"], data["price"], data.get("image", "")))
    db.commit()
    return jsonify({"msg": "Added"})

@app.route("/order", methods=["POST"])
@jwt_required()
def order():
    user_id = get_jwt_identity()
    data = request.json
    db = get_db()
    db.execute("INSERT INTO orders (user_id, items, status) VALUES (?, ?, 'pending')", 
              (user_id, json.dumps(data["cart"])))
    db.commit()
    return jsonify({"msg": "Order OK"})

@app.route("/orders")
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    db = get_db()
    if user_id == "1":
        orders = db.execute("SELECT * FROM orders ORDER BY id DESC").fetchall()
    else:
        orders = db.execute("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC", (user_id,)).fetchall()
    return jsonify([dict(o) for o in orders])

if __name__ == "__main__":
    app.run(debug=True, port=5000)
