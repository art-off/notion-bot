FROM node:18-alpine

WORKDIR /notion-bot

COPY package.json ./

RUN npm install --production

COPY data/ ./data
COPY src/ ./src
COPY .env .

CMD [ "npm", "start" ]