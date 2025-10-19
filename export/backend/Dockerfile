# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY src ./src

ENV PORT=4000
EXPOSE 4000
CMD ["npm", "start"]
