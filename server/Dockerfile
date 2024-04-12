FROM node:18-alpine as builder

WORKDIR /app/sever

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app/server

COPY --from=builder /app/server/package*.json ./

COPY --from=builder /app/server/dist ./dist

RUN npm ci --only=production

EXPOSE 4000

CMD ["node", "dist/index.js"]