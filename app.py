import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

# --- App Configuration ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key' # Change this to a random secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///campuscare.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index' # Redirect to index page for login


# --- Database Models ---
class FoundItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_filename = db.Column(db.String(100), nullable=True)
    contact = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<LostItem {self.item_name}>'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    found_items = db.relationship('FoundItem', backref='reporter', lazy=True)
    lost_items = db.relationship('LostItem', backref='reporter', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lost')
@login_required
def lost_page():
    # Corrected path to include the 'lost_report' subfolder
    return render_template('lost_report/lost.html')

@app.route('/found')
@login_required
def found_page():
    # Corrected path to include the 'founditem' subfolder
    return render_template('founditem/found.html')

@app.route('/listings')
def listings_page():
    found_items = FoundItem.query.order_by(FoundItem.timestamp.desc()).all()
    lost_items = LostItem.query.order_by(LostItem.timestamp.desc()).all()
    return render_template('listings.html', found_items=found_items, lost_items=lost_items)

# --- Auth Routes ---
@app.route('/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    first_name = request.form.get('firstName')
    last_name = request.form.get('lastName')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if user:
        flash('Email address already exists.', 'error')
        return redirect(url_for('index'))

    new_user = User(email=email, first_name=first_name, last_name=last_name)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    flash('Account created successfully! Please log in.', 'success')
    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        flash('Please check your login details and try again.', 'error')
        return redirect(url_for('index'))

    login_user(user, remember=remember)
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

# --- Form Submission Routes ---
@app.route('/report-found', methods=['POST'])
@login_required
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
        image_filename=filename,
        user_id=current_user.id
    )
    db.session.add(new_item)
    db.session.commit()
    return redirect(url_for('listings_page'))


@app.route('/report-lost', methods=['POST'])
@login_required
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
        image_filename=filename,
        user_id=current_user.id
    )
    db.session.add(new_item)
    db.session.commit()
    return redirect(url_for('listings_page'))
    
# --- Main Execution ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all() # This creates the database and tables
    app.run(debug=True)