FROM node:18.16


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "/home/node/app/index.js"]