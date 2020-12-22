FROM node:15.3.0

# set arguments
ARG DIR=/usr/server_container
ARG PORT=2000
ARG ENV=development
ARG MONGO_URL=mongodb://professional-db:27017

# create container directories
WORKDIR ${DIR}

# set working directory and environment variables
ENV PORT=${PORT} NODE_ENV=${ENV} MONGO_URL=${MONGO_URL} PATH=${DIR}/node_modules/.bin:$PATH

# copy files, install dependencies and create container
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 2000
USER node
CMD nodemon ./src/server.ts