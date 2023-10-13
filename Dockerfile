FROM node:18.17.1 as builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM bitnami/nginx:1.25.2
COPY --from=builder /app/dist/bright-charge-web/ /app/
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/web-app.conf

EXPOSE 4200
