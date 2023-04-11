FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm install typescript -g && bash ./initialize.sh

RUN cd ./backend && npm run build:all:prod

EXPOSE 3000

CMD ["node", "./backend/build/server.js"]
