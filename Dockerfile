FROM node:18-alpine AS builder
WORKDIR /app
ENV CI=true
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/motos_manager /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
