FROM node:alpine
ENV CI=true

WORKDIR /app

COPY package.json .
# this will prevent installing the dev dependencies
RUN npm install --only=prod
COPY . .
CMD ["npm","start"]