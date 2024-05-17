FROM python:3.12.3-bullseye

RUN apt-get update
RUN apt-get install -y build-essential curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs --no-install-recommends
RUN apt-get clean

RUN python -m pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN rm -rf /var/lib/apt/lists/*

COPY ./aldenluthfi /app
WORKDIR /app

COPY start.sh /start.sh

ENTRYPOINT ["sh", "/start.sh"]