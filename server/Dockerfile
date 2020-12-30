FROM node:14

WORKDIR /usr/src/app    

copy package*.json ./

RUN npm install

COPY . .
COPY .env.production .env

RUN npm run build

ENV NODE_ENV production

EXPOSE 8080
CMD ["node", "dist/index.js"]
USER node