#Stage 1
FROM node:18-alpine as builder
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
