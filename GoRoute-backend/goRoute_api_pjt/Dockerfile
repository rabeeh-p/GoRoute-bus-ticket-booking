FROM python:3.11.1


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1



WORKDIR /app

COPY requirements.txt /app/

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

EXPOSE 8000



RUN python manage.py collectstatic --noinput 



CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "goRoute_api_pjt.asgi:application"]