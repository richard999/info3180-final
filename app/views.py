"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, db, login_manager
from sqlalchemy import desc
from flask import render_template, request, redirect, url_for, flash,_request_ctx_stack,make_response,g,jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import LoginForm
from app.models import Users,Cars,Favourites
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import jwt
from functools import wraps
import datetime,os
from app.forms import LoginForm,SignupForm,NewCar,Search
 




###
 ## route for jwt 
###
def requires_token(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        logout_user()
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated


###
# Routing for your application.
###

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


""
#Register API
""
@app.route('/api/register',methods=["POST"])
def register():
    form=SignupForm()
    if request.method == 'POST' and form.validate_on_submit():
            username=form.username.data
            password=form.password.data
            fullname=form.fullname.data
            email=form.email.data
            location= form.location.data
            bio=form.bio.data
            photo= form.photo.data
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            user=Users(username=username,password=password,name=fullname,email=email,location=location,biography=bio,photo=filename,date_joined=datetime.datetime.now(datetime.timezone.utc))
            db.session.add(user)
            db.session.commit()
            udict=dict(user.tojson())
            send={ "id":udict["id"],
                  "username":udict["username"],
                   "photo":udict["photo"],
                  "email":udict["email"],
                  "location":udict["location"],
                  "biography":udict["biography"],
                  "date_joined":udict["date_joined"],
            }
            return jsonify(send)
    else:
        response = {
                "errors": form_errors(form)
            }
        return  jsonify(response)

#Form Errors

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages










#Login API

@app.route("/api/auth/login", methods=["POST"])
def login():
    logout_user()
    if current_user.is_authenticated:
        return jsonify({"errors": ["User loged in"]}),406

    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        # change this to actually validate the entire form submission
        # and not just one field
        username = form.username.data
        password = form.password.data

        if username and password:
            # Get the username and password values from the form.

            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.
            user = Users.query.filter_by(username=username).first()
        
            if user is not None and check_password_hash(user.password, password):
                remember_me  = False

                if 'remember_me' in request.form:
                    remember_me = True

                # get user id, load into session
                login_user(user, remember=remember_me)
                #token
                payload = {
                    'user_id':user.id,
                    'username': user.username,
                    'iat': datetime.datetime.now(datetime.timezone.utc),
                    'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)}
                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
                # json
                message={"message":'Logged in successfully',"token":token}
                return jsonify(message),200
            else:
                message={ "errors" :['Login failed'],"token":None}
                return jsonify(message),401
    else:
        response = {
                "errors": form_errors(form)
            }
        return  jsonify(response),401


@app.route('/api/auth/logout', methods=['POST'])
@requires_token
def logout():
    logout_user()
    return jsonify({"message": "User Logged Out Successfully"})
    

@app.route("/api/cars",methods=["GET", "POST"])
@requires_token
def cars():
    if request.method == "POST":
        form=NewCar()
        if form.validate_on_submit():
            make=form.make.data
            model=form.model.data
            color=form.color.data
            year=form.year.data
            price=form.price.data
            cartype=form.cartype.data
            transmission=form.transmission.data
            description=form.description.data
            photo= form.photo.data
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            id=current_user.get_id()
            car=Cars(description=description, make=make, model=model, colour=color, year=year, transmission=transmission, car_type=cartype, price=price,photo=filename, user_id=id)
            db.session.add(car)
            db.session.commit()
            send={"message":["Car Added Sucessfull"]}
            return jsonify(send)
        else:
            response = {"errors": form_errors(form)}
            return  jsonify(response)
    elif request.method=="GET":
        cars=Cars.query.order_by(desc(Cars.id)).limit(3).all()[::-1]
        lst=[]
        for car in cars:
            car={"id": car.id,
                 "description": car.description,
                 "year": car.year,
                 "make": car.make,
                 "model": car.model,
                 "colour": car.colour,
                 "transmission": car.transmission,
                 "cartype": car.car_type,
                 "price": car.price,
                 "photo": car.photo,
                  "user_id": car.user_id
                  }
            lst.append(car)
        return jsonify(lst)


@app.route("/api/cars/<int:car_id>",methods=["GET"])
@requires_token
def getCar(car_id):
    if request.method=="GET":
        car=Cars.query.get_or_404(car_id)
        if car!="404":
            car={"id": car.id,
                 "description": car.description,
                 "year": car.year,
                 "make": car.make,
                 "model": car.model,
                 "colour": car.colour,
                 "transmission": car.transmission,
                 "cartype": car.car_type,
                 "price": car.price,
                 "photo": car.photo,
                  "user_id": car.user_id
            }
            return jsonify(car)
    return jsonify({"erros": ["invalid"]})
@app.route("/api/cars/<int:car_id>/favourite",methods=["POST"])
@requires_token
def addToFav(car_id):
    if request.method=="POST":
        if Favourites.query.filter_by(car_id=int(car_id),user_id=current_user.get_id()).first() is None:
            fav=Favourites(car_id=int(car_id),user_id=current_user.get_id())
            db.session.add(fav)
            db.session.commit()
            message={"message": "Car Successfully Favourited","car_id": car_id}
        else:
            message={ "errors": ["Car Already Favourited"],
            "car_id": car_id,
            }
        return jsonify(message)

@app.route("/api/search",methods=["POST"])
@requires_token
def search():
    form=Search()
    if request.method=="POST" and form.validate_on_submit():
            make=form.make.data
            model=form.model.data
            if len(model)==0 and len(make)==0:
                cars=Cars.query.all()
            elif len(model)==0 and len(make)!=0:
                cars=Cars.query.filter_by(make=make).all()
            elif len(make)==0 and len(model)!=0:
                cars=Cars.query.filter_by(model=model).all()
            else:
                cars=Cars.query.filter_by(make=make,model=model).all()
            lst=[]
            for car in cars:
                car={"id": car.id,
                    "description": car.description,
                    "year": car.year,
                    "make": car.make,
                    "model": car.model,
                    "colour": car.colour,
                    "transmission": car.transmission,
                    "cartype": car.car_type,
                    "price": car.price,
                    "photo": car.photo,
                    "user_id": car.user_id
                    }
                lst.append(car)
            return jsonify(lst)
    else:
            esponse = {"errors": form_errors(form)}
            return  jsonify(response)

@app.route("/api/users/<int:user_id>")
@requires_token
def getUser(user_id):
    user=Users.query.filter_by(id=user_id).first()
    send={
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "photo": user.photo,
        "email": user.email,
        "location": user.location,
        "biography": user.biography,
        "date_joined": user.date_joined
     }
    return jsonify(send)
@app.route("/api/users/<int:user_id>/favourites")
@requires_token
def getUserFav(user_id):
    favs=Favourites.query.filter_by(user_id=user_id).all()
    lst=[]
    for fav in favs:
         car=Cars.query.get(fav.car_id)
         cart={"id": car.id,"description": car.description,"year": car.year,
                 "make": car.make,"model": car.model,"colour": car.colour,"transmission": car.transmission,
                 "cartype": car.car_type,"price": car.price,"photo": car.photo,"user_id": car.user_id}
         lst.append(cart)
    return jsonify(lst)

@app.route('/secure-page')
@login_required
def secure_page():
    return render_template('secure_page.html')

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
            ), 'danger')


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")