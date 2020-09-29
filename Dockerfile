FROM node:10.22.0-alpine

RUN mkdir -p /var/www/send_sms

COPY ./send_sms.js ./package.json /var/www/send_sms/

RUN npm install

WORKDIR /var/www/send_sms

EXPOSE 3000

ENTRYPOINT npm run start
