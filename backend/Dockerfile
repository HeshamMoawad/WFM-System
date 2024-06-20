FROM python:3.7-alpine


WORKDIR /app

COPY /backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


COPY /backend .


RUN python /app/backend/manage.py collectstatic --noinput

EXPOSE 8000

ENV DJANGO_SETTINGS_MODULE = project.settings

ENV PYTHONUNBUFFERED = 1

RUN python makemigrations

RUN python migrate


CMD ["python","/app/backend/manage.py","runserver"]