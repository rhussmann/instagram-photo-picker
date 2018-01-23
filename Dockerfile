FROM mpneuried/nodejs-alpine-buildtools-gm:latest

ADD src /app
WORKDIR /app
RUN npm install

EXPOSE 8000
CMD ["npm", "run", "prodStart"]
