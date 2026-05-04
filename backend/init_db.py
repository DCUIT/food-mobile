import sqlite3

DB_PATH = "database.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create tables
cursor.executescript("""
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

# Insert admin
cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES ('admin', '123')")

# Demo foods
demo_foods = [
    ("Phở Bò", 45000, ""),
    ("Bún Chả", 35000, ""),
    ("Bánh Mì", 25000, ""),
    ("Cơm Tấm", 40000, "")
]
cursor.executemany("INSERT OR IGNORE INTO foods (name, price, image) VALUES (?, ?, ?)", demo_foods)

conn.commit()
conn.close()

print("✅ DB initialized! Admin: admin/123 | Demo foods ready!")
