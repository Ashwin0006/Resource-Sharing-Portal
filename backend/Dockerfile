# Builder Phase
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Running Phase
FROM node:18

WORKDIR /app

COPY --from=builder /app .

EXPOSE 5000

CMD ["npm", "start"]
