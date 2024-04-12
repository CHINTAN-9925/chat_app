FROM node:18-alpine3.15 as builder

WORKDIR /app/client

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine3.15

WORKDIR /app/client

COPY --from=builder /app/client/package*.json ./
COPY --from=builder /app/client/.next ./.next
COPY --from=builder /app/client/public ./public

RUN npm ci --only=production

RUN rm -rf package*.json

EXPOSE 3000

CMD ["npm", "start"]
