# Alpine (musl) + Prisma ikilisi OpenSSL sürüm tespitinde sorun çıkarıyordu:
# hem sorgu hem şema motoru libssl.so.1.1 arayıp bulamıyordu.
# Debian tabanlı imaj bu sınıf sorunları tamamen ortadan kaldırıyor.
FROM node:20-slim

# Prisma motorlarının ihtiyaç duyduğu OpenSSL
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Prisma şeması bağımlılıklardan ÖNCE kopyalanır:
# package.json'daki "postinstall": "prisma generate" adımı şemaya ihtiyaç duyar.
COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
