from marshmallow import Schema, fields


class ImageUploadSchema(Schema):
    image_id = fields.Int(required=True)
    image_name = fields.Str(required=True)
    image_location = fields.Str(required=True)
