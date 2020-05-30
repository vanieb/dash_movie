FROM node:10.16.0

WORKDIR /usr/src/app
EXPOSE 8888
COPY package.json package.json
RUN npm install

# To include everything
COPY . .

# CMD npm run serve
CMD npm run build
