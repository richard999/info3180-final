from . import db


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
    
