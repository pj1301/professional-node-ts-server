FROM node:14.4-alpine3.10

WORKDIR /server_container

RUN mkdir -p /server_container/node_modules && chown -R node:node /server_container

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 2000

CMD ["npm", "start"]