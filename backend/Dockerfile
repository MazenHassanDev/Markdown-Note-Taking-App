FROM python:3.14-slim

WORKDIR /app

COPY . .

RUN pip install uv
RUN apt-get update && apt-get install -y pkg-config default-libmysqlclient-dev build-essential
RUN uv sync

EXPOSE 8000

CMD ["uv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]