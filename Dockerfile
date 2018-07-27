# base from small linux/node image
FROM node:8-alpine

# set working directory to app directory
RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*
RUN mkdir -p /usr/src/pep-loader
WORKDIR /usr/src/apps/pep-loader

# package files in separate step to support caching
COPY package*.json ./

ENV NODE_ENV production
ENV PORT 8080
ENV COUCHBASE_HOST 127.0.0.1

# install application dependencies
RUN npm i -g forever
RUN npm i --production

# copy application files
COPY . .

# expose port 8080
EXPOSE 8080

# start application
CMD ["forever", "app.js"]