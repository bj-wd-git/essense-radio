FROM node:18-alpine

# Install build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Note: Native modules will be rebuilt on container start via docker-compose command
CMD ["npm", "run", "start:dev"]

