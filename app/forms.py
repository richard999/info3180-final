from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, PasswordField, TextAreaField, SelectField
from wtforms.validators import InputRequired, Email


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

class SignupForm(FlaskForm):
    username= StringField('Username', validators=[InputRequired()])
    password= PasswordField('Password',validators=[InputRequired()])
    fullname= StringField('Enter Full Name', validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired(),Email()])
    location= StringField('Username', validators=[InputRequired()])
    bio= TextAreaField('Bio', validators=[InputRequired()])
    photo = FileField('Photo', validators=[
        FileRequired(), FileAllowed(['jpg', 'png', 'Images only!'])])
    
class NewCar(FlaskForm):
    make= StringField('Make Eg. Honda', validators=[InputRequired()])
    model= StringField('Model Eg Civic', validators=[InputRequired()])
    color= StringField('Color', validators=[InputRequired()])
    year= StringField('Year', validators=[InputRequired()])
    price = StringField('Price', validators=[InputRequired()])
    cartype= SelectField('Car Type', choices=[('Sedan','Sedan'),('Suv','Suv'),('Crossover','Crossover'),('Hatchback','Hatchback'),
                                              ('Truck','Truck'),('Pickup','Pickup'),('Bus','Bus')])
    transmission= SelectField('Transmission', choices=[('Automatic','Automatic'),('Manual','Manual'),('Electric','Electric')])
    description= TextAreaField('Description', validators=[InputRequired()])
    photo = FileField('Photo', validators=[
        FileRequired(), FileAllowed(['jpg', 'png', 'Images only!'])])

class Search(FlaskForm):
    make=make= StringField('Make Eg. Honda', validators=[InputRequired()])
    model= StringField('Model Eg Civic',)
    
    
