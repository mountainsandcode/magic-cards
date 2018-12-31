FROM node:9.11.1-alpine

#RUN npm install yarn -g - not required, as included with node https://github.com/nodejs/docker-node/issues/661
RUN npm install concurrently -g

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN script/docker/setup

EXPOSE 8125
CMD [ "script/stack" ]
