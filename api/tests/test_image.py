from models.image import ImageUpload, db
import pytest
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from routes.urls import urls
import os


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"

    db.init_app(app)

    app.register_blueprint(urls, url_prefix="/image")
    return app


@pytest.fixture()
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.testing = True
    with app.app_context():
        db.create_all()
        uploads_url = os.path.abspath("tests")
        file_path = os.path.join(uploads_url, "test_files/test.jpeg")
        test_image = ImageUpload(image_name="test.jpg", image_location=file_path)
        test_image_1 = ImageUpload(image_name="test.jpg", image_location=file_path)
        db.session.add_all([test_image, test_image_1])
        db.session.commit()

    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_index_route(client):
    response = client.get("/image/")

    assert response.status_code == 201


def test_analyze_image(app, client):

    with app.app_context():

        response = client.get(f"/image/analyze/1/")
        assert response.status_code == 200
        assert response.json == {"height": 2160, "width": 3840}

        # Test retrieving image information with an invalid image ID
        response = client.get("/image/analyze/999/")
        assert response.status_code == 404
        assert response.json == {"message": "We don't have an image with the given ID 999"}


def test_image_list(app, client):

    with app.app_context():

        response = client.get("/image/list/")
        assert len(response.json) == 2
        assert response.status_code == 200


def test_upload_image(app, client):
    # Create a test image file
    with app.app_context():
        image_file = open(f"{os.path.abspath('tests')}/test_files/test.jpeg", "rb")

        # Send a POST request to the endpoint with the image file in the request
        response = client.post("/image/upload/", data={"image": image_file})

        # Check that the response status code is 201 (created)
        assert response.status_code == 201

        # Check that the response contains the serialized image data
        assert "image_id" in response.json
        assert "image_name" in response.json
        assert "image_location" in response.json
        os.remove(response.json["image_location"])
