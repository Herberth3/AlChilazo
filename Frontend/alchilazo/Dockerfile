FROM node:latest

WORKDIR /app

COPY ./Frontend/alchilazo/package.json ./
RUN npm install

COPY ./Frontend/alchilazo .

EXPOSE 3000

CMD ["npm", "start"]