import os
import sqlite3
from uuid import uuid4
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, g

# -------------------------------------------------
# Configuration
# -------------------------------------------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
DB_PATH = os.path.join(BASE_DIR, 'data', 'database.db')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DATABASE'] = DB_PATH
app.secret_key = 'dev-secret-change-this'  # Change this in production!

# -------------------------------------------------
# Database helpers
# -------------------------------------------------
def get_db():
    """Connect to the SQLite database (per request)."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(app.config['DATABASE'])
        db.row_factory = sqlite3.Row
    return db


def init_db():
    """Create tables if they do not exist."""
    db = get_db()
    cur = db.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS lost_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        image_filename TEXT,
        contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    cur.execute('''
    CREATE TABLE IF NOT EXISTS found_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        image_filename TEXT,
        contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    db.commit()


@app.teardown_appcontext
def close_connection(exception):
    """Close the database connection after each request."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# -------------------------------------------------
# Utility functions
# -------------------------------------------------
def allowed_file(filename):
    """Check if a filename has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file_storage):
    """Save an uploaded image file and return its new unique filename."""
    if not file_storage:
        return None
    filename = file_storage.filename
    if filename == '':
        return None
    if allowed_file(filename):
        ext = filename.rsplit('.', 1)[1].lower()
        unique_name = f"{uuid4().hex}.{ext}"
        path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
        file_storage.save(path)
        return unique_name
    return None

# -------------------------------------------------
# Routes
# -------------------------------------------------
@app.route('/')
def home():
    """Homepage (optional index.html)."""
    return render_template('index.html')


@app.route('/report/lost', methods=['GET', 'POST'])
def report_lost():
    """Lost item report form."""
    if request.method == 'POST':
        item_name = request.form.get('item-name', '').strip()
        description = request.form.get('description', '').strip()
        category = request.form.get('category', '').strip()
        contact = request.form.get('contact', '').strip()
        file = request.files.get('item-image')

        if not item_name or not description or not contact:
            flash('Please fill required fields (item name, description, contact).', 'error')
            return redirect(request.url)

        saved = save_upload(file)
        db = get_db()
        db.execute(
            'INSERT INTO lost_items (item_name, description, category, image_filename, contact) VALUES (?, ?, ?, ?, ?)',
            (item_name, description, category, saved, contact)
        )
        db.commit()
        flash('Lost item reported successfully!', 'success')
        return redirect(url_for('listings'))

    return render_template('lost.html')


@app.route('/report/found', methods=['GET', 'POST'])
def report_found():
    """Found item report form."""
    if request.method == 'POST':
        item_name = request.form.get('item-name', '').strip()
        description = request.form.get('description', '').strip()
        category = request.form.get('category', '').strip()
        contact = request.form.get('contact', '').strip()
        file = request.files.get('item-image')

        if not item_name or not description or not contact:
            flash('Please fill required fields (item name, description, contact).', 'error')
            return redirect(request.url)

        saved = save_upload(file)
        db = get_db()
        db.execute(
            'INSERT INTO found_items (item_name, description, category, image_filename, contact) VALUES (?, ?, ?, ?, ?)',
            (item_name, description, category, saved, contact)
        )
        db.commit()
        flash('Found item reported successfully!', 'success')
        return redirect(url_for('listings'))

    return render_template('found.html')


@app.route('/listings')
def listings():
    """Display lost and found items."""
    db = get_db()
    lost = db.execute('SELECT * FROM lost_items ORDER BY created_at DESC').fetchall()
    found = db.execute('SELECT * FROM found_items ORDER BY created_at DESC').fetchall()
    return render_template('listings.html', lost_items=lost, found_items=found)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded images."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# -------------------------------------------------
# Main entry point (Flask 3.x–safe initialization)
# -------------------------------------------------
if __name__ == '__main__':
    with app.app_context():
        init_db()   # initialize tables before starting the server
    app.run(debug=True)
