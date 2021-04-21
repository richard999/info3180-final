from . import db
from werkzeug.security import generate_password_hash
from flask_login._compat import unicode


class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))
    name = db.Column(db.String(80))
    email = db.Column(db.String(80), unique=True)
    location= db.Column(db.String(80))
    biography= db.Column(db.String(240))
    photo= db.Column(db.String(80))
    datejoined= db.Colum(db.DateTime)
    
     def __init__(self, username, password, name, email, location, biography, photo,datejoined):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.name = name
        self.email = email
        self.location= location
        self.biography=biography
        self.photo= photo
        self.datejoined= datejoined
        
        
        


    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)

class Cars(db.Model):
    carid= db.Column(db.Integer, primary_key=True)
    description= db.Column(db.String(500))
    make= db.Column(db.String(80))
    model= db.Column(db.String(80))
    color= db.Column(db.String(80))
    year= db.Column(db.String(80))
    transmission= db.column(db.String(80))
    cartype= db.column(db.String(80))
    price= db.Column(db.Float)
    photo= db.Column(db.String(80))
    # foriegn key needs to be added here
    user_id= db.Column(db.Integer)
    
     def __init__(self, description, make, model, colour, year, transmission, car_type, price, photo, user_id ):
        self.description = description
        self.make = make
        self.model = model
        self.colour = colour
        self.year= year
        self.transmission=transmission
        self.car_type= car_type
        self.price= price
        self.photo= photo
        self.user_id= user_id

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

class Favourites(db.Model):
    
    id= db.Column(db.Integer, primary_key=True)
    carid= db.Column(db.Integer)
    user_id= db.Column(db.Integer)
    
     def __init__(self, carid, user_id ):
        self.carid= carid
        self.user_id= user_id

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

