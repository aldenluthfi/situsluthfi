FROM node:slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-mysql-client \
    texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/assets/fonts /app/assets/images

COPY assets/fonts/ /app/assets/fonts/

COPY init.sql /docker-entrypoint-initdb.d/init.sql
COPY init-db.sh /init-db.sh
RUN chmod +x /init-db.sh && npm run lint && npm run build

EXPOSE 3000

CMD ["/bin/sh", "-c", "/init-db.sh && npm start"]
