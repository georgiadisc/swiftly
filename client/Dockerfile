FROM node:20 AS build-env
ADD . /app
WORKDIR /app
RUN npm install
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run", "start"]