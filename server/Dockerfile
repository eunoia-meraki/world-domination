FROM node:17.4.0-alpine AS development

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

########################
###### PRODUCTION ######
########################

FROM node:17.4.0-alpine AS production

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_ENV=production

WORKDIR /app

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json

# Run app
CMD [ "npm", "run", "start:prod" ]

# before manual running you should pass env variables to container: PORT, JWT_SECRET, MONGO_CONNECTION_STRING
# docker build . -t tmp --target production
# docker run --rm -it tmp sh