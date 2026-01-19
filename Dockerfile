FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./

RUN npm run build && npm prune --production

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/http.js"]
