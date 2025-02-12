# Usa un'immagine base di Python
FROM python:3.9-slim

# Imposta la directory di lavoro
WORKDIR /app

ENV PYTHONPATH=/app
COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

# if not volume docker
# Copia i file necessari
COPY . .
#else
# Copia solo i file necessari
#COPY requirements.txt /app/
#endif


CMD ["python", "app/__init__.py"]
