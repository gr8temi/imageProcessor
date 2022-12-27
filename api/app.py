from exceptions.exceptions import handle_404
from flask import Flask
from flask_migrate import Migrate
from models.image import db
from routes.urls import urls
from flask_cors import CORS

app = Flask(__name__)
CORS(urls)
app.config.from_object("config")
app.config["CORS_ALLOW_HEADERS"] = "*"
app.config["CORS_HEADERS"] = "Content-Type"
app.register_error_handler(FileNotFoundError, handle_404)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(urls, url_prefix="/")

if __name__ == "__main__":
    app.debug = True
    app.run
