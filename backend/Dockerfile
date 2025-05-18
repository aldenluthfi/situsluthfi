FROM node:slim

WORKDIR /app

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

COPY init.sql /docker-entrypoint-initdb.d/init.sql
COPY init-db.sh /init-db.sh
RUN chmod +x /init-db.sh && npm run build

EXPOSE 3000

CMD ["/bin/sh", "-c", "/init-db.sh && node dist/db/seed.js && npm start"]
