FROM node:12

WORKDIR /notion-bot

COPY package.json ./

RUN npm install

COPY data/ ./data
COPY src/ ./src
COPY .env .

CMD [ "npm", "start" ]