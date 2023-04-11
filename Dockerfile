FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm install typescript -g && bash ./initialize.sh

EXPOSE 3000

CMD ["bash", "./start.sh"]
