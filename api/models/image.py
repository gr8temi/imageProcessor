from PIL import Image

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ImageUpload(db.Model):

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_name = db.Column(db.String(255), nullable=False)
    image_location = db.Column(db.Text(), nullable=False)

    @property
    def image_info(self):
        """Retrieve the width and height of an image.

        Returns:
            dict: A dictionary containing the image width and height.
        """

        image = Image.open(self.image_location)
        width, height = image.size
        return {"width": width, "height": height}

    @property
    def serialize(self):
        """Serialize an ImageUpload object into a dictionary.

        Returns:
            dict: A dictionary containing the image ID, name, and location.
        """
        return {
            "image_id": self.image_id,
            "image_name": self.image_name,
            "image_location": self.image_location,
        }
