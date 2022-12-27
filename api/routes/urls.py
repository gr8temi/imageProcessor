from flask import Blueprint
from views.image import index, upload_image, analyze_image, list_images, get_image

urls = Blueprint("urls", __name__)

urls.route("/", methods=["GET"])(index)
urls.route("/upload/", methods=["POST"])(upload_image)
urls.route("/analyse_image/<int:image_id>/", methods=["GET"])(analyze_image)
urls.route("/list_images/", methods=["GET"])(list_images)
urls.route("/<string:filename>/", methods=["GET"])(get_image)
