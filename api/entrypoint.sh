#!/usr/bin/env sh
python -m flask db migrate
python -m flask db upgrade
flask run --host=0.0.0.0 --port=5002