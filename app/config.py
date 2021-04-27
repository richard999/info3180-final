import os

class Config(object):
    """Base Config Object"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'Som3$ec5etK*y'
    SQLALCHEMY_DATABASE_URI ="postgresql://kixjkuszwdlhre:b246a116baa98a2aca50d7c733080b8f0402f550173586791303cfa5a51c6087@ec2-54-166-167-192.compute-1.amazonaws.com:5432/d5ch54638tipg4'
    SQLALCHEMY_TRACK_MODIFICATIONS = False # This is just here to suppress a warning from SQLAlchemy as it will soon be removed
    UPLOAD_FOLDER = './app/static/uploads'
    #####

class DevelopmentConfig(Config):
    """Development Config that extends the Base Config Object"""
    DEVELOPMENT = True
    DEBUG = True

class ProductionConfig(Config):
    """Production Config that extends the Base Config Object"""
    DEBUG = False
    #set DATABASE_URL=postgresql://info3180-project2-user:info3180-project2@localhost/info3180-project2
    #"postgresql://info3180-project2-user:info3180-project2@localhost/info3180-project2"