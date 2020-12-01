FROM node:15.3.0

WORKDIR /server_container
ENV PORT=2000 NODE_ENV=development MONGO_URL=mongodb://mongo:27017
RUN mkdir -p /server_container/node_modules && chown -R node:node /server_container
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 2000
CMD ["npm", "start"]