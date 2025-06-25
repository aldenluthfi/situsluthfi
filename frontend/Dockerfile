FROM node:slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run lint && npm run build

FROM fholzer/nginx-brotli:latest

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["-g", "daemon off;"]
