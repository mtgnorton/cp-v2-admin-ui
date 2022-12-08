FROM node:12
WORKDIR /usr/src/app
COPY . .
EXPOSE 8090
CMD ["npm","run","dev"]
