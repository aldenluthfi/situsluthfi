# Build context is the repo root so archived versions can be built alongside
# the current frontend and served under /archive/<version>/.

FROM node:22-slim AS archive-vI

WORKDIR /app

COPY archive/v1/package*.json ./
RUN npm ci

COPY archive/v1/ .

RUN npx tsc -b && npx vite build --base=/archive/vI/

FROM node:22-slim AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

RUN npm run build

FROM fholzer/nginx-brotli:latest

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=archive-vI /app/dist /usr/share/nginx/html/archive/vI

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["-g", "daemon off;"]
