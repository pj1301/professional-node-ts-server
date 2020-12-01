FROM node:15.3.0

WORKDIR /usr/server_container
ENV PORT=2000 NODE_ENV=development MONGO_URL=mongodb://mongo:27017 PATH=./node_modules/.bin:$PATH
COPY package*.json ./
RUN npm i && npm cache clean --force
COPY . .
EXPOSE 2000
CMD nodemon ./src/server.ts