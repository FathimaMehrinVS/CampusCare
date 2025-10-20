import os
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.utils import secure_filename

# --- App Configuration ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key' # Change this to a random secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///campuscare.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# --- Database Models ---
class FoundItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_filename = db.Column(db.String(100), nullable=True)
    contact = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<FoundItem {self.item_name}>'

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_filename = db.Column(db.String(100), nullable=True)
    contact = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<LostItem {self.item_name}>'

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lost')
def lost_page():
    # Corrected path to include the 'lost_report' subfolder
    return render_template('lost_report/lost.html')

@app.route('/found')
def found_page():
    # Corrected path to include the 'founditem' subfolder
    return render_template('founditem/found.html')

@app.route('/listings')
def listings_page():
    found_items = FoundItem.query.order_by(FoundItem.timestamp.desc()).all()
    lost_items = LostItem.query.order_by(LostItem.timestamp.desc()).all()
    return render_template('listings.html', found_items=found_items, lost_items=lost_items)

# --- Form Submission Routes ---
@app.route('/report-found', methods=['POST'])
def report_found():
    image_file = request.files.get('item-image')
    filename = None
    if image_file and image_file.filename != '':
        filename = secure_filename(image_file.filename)
        image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    new_item = FoundItem(
        item_name=request.form['item-name'],
        description=request.form['description'],
        category=request.form['category'],
        contact=request.form['contact'],
        image_filename=filename
    )
    db.session.add(new_item)
    db.session.commit()
    return redirect(url_for('listings_page'))


@app.route('/report-lost', methods=['POST'])
def report_lost():
    image_file = request.files.get('item-image')
    filename = None
    if image_file and image_file.filename != '':
        filename = secure_filename(image_file.filename)
        image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
    new_item = LostItem(
        item_name=request.form['item-name'],
        description=request.form['description'],
        category=request.form['category'],
        contact=request.form['contact'],
        image_filename=filename
    )
    db.session.add(new_item)
    db.session.commit()
    return redirect(url_for('listings_page'))
    
# --- Main Execution ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all() # This creates the database and tables
    app.run(debug=True)