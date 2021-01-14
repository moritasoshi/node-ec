FROM node:12-alpine

COPY . /home/node/webapp

RUN cd /home/node/webapp; \
    yarn install;

EXPOSE 3000

WORKDIR /home/node/webapp
CMD [ "npm", "start" ]