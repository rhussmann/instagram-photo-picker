FROM mpneuried/nodejs-alpine-buildtools-gm:latest

ADD . /app
WORKDIR /app
RUN npm install

EXPOSE 8000
CMD ["node", "server.js"]
