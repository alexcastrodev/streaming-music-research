FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./backend2/package*.json ./

RUN npm install

COPY ./backend2 .

COPY ./backend/assets ./assets

EXPOSE 3001

CMD ["npm", "start"]