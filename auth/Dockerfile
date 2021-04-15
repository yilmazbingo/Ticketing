FROM node:alpine
ENV CI=true

WORKDIR /app

COPY package.json .
# this will prevent installing the dev dependencies specificlaly testing packages
RUN npm install --only=prod
COPY . .
CMD ["npm","start"]