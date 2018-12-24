FROM node:carbon-jessie
WORKDIR /app
COPY . /app
RUN apt-get update
RUN apt-get install -y librdkafka-dev libsasl2-dev
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "run", "serve"]