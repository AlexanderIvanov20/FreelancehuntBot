FROM node:14.2

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
RUN npm install -g typescript
COPY . .
RUN tsc

CMD [ "node", "dist/BotItself.js"]