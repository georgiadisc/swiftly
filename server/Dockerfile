FROM node:20 AS build-env
ADD . /app
WORKDIR /app
RUN npm install
CMD ["npm", "run", "start"]