#!/usr/bin/env bash
python manage.py makemigrations & python manage.py migrate
# docker run -p 6379:6379 -d redis:5
# python manage.py runserver
