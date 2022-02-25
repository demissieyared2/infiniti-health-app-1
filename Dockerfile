FROM node:16.13.1 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . ./
RUN npm run build --prod
EXPOSE 80
CMD [ "node", "server.js" ]
