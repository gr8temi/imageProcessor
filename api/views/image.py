import os
from serializer.image import ImageUploadSchema

from flask import request, Response, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import filetype
from flask_cors import cross_origin
from models.image import ImageUpload
from models.image import db


def index():
    return {"a": "c"}, 201


@cross_origin()
def upload_image():
    """Upload an image and save it to the database.

    Returns:
        A tuple containing a dictionary with the serialized image data and an integer status code. The status code is
        201 if the image is successfully uploaded, or 400 if the uploaded file is not an image.
    """
    file = request.files["image"]
    if filetype.is_image(file):
        # save uploaded file to upload directory
        file_path = os.path.join("uploads", secure_filename(file.filename))
        file.save(file_path)

        # Store information about the uploaded image in the database
        upload = ImageUpload(image_name=file.filename, image_location=file_path)
        db.session.add(upload)
        db.session.commit()
        return upload.serialize, 201

    return {"message": "File uploaded is not an image"}, 400


@cross_origin()
def analyze_image(image_id):
    """Retrieve image information from the database.

    Parameters:
        image_id (int): ID of the image to retrieve.

    Returns:
        dict: A dictionary containing the image information.
        int: HTTP status code.
    """
    print(image_id, "no")
    image = ImageUpload.query.filter_by(image_id=image_id).first()

    if bool(image):
        return image.image_info, 200
    return {"message": f"We don't have an image with the given ID {image_id}"}, 404


@cross_origin()
def list_images():
    """Retrieve a list of all images stored in the database.

    Returns:
        dict: A dictionary containing a list of images.
        int: HTTP status code.
    """
    image_upload_schema = ImageUploadSchema(many=True)

    image_files = ImageUpload.query.order_by(ImageUpload.image_id.desc()).all()
    # Serialize image files
    images = image_upload_schema.dump(
        image_files,
    )
    return jsonify(images), 200


@cross_origin()
def get_image(filename):
    return send_file(f"uploads/{secure_filename(filename)}", mimetype="image/png")
