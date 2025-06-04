# Stage 1: Build aplikasi React
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json terlebih dahulu (untuk caching)
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy semua file proyek
COPY . .

# Build aplikasi React (hasilnya di folder /app/build)
RUN npm run build

# Stage 2: Serve static files dengan Nginx
FROM nginx:alpine

# Salin konfigurasi Nginx kustom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari stage builder ke Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (default Nginx)
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]