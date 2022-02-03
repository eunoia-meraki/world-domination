FROM node:17.4.0-alpine AS development

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# server part

COPY ./server/package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY ./server/ .

RUN pnpm run build

########################
###### PRODUCTION ######
########################

FROM node:17.4.0-alpine AS production

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# client part

RUN npm install -g pnpm

RUN mkdir webapp_proj

COPY ./webapp/package*.json ./webapp_proj

RUN pnpm install --prefix webapp_proj

COPY ./webapp ./webapp_proj

RUN pnpm run prod --prefix webapp_proj

RUN cp -r ./webapp_proj/build ./webapp && rm -rf ./webapp_proj

# server part

ENV NODE_ENV=production

COPY --from=development /app/dist ./dist
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json

# Run app
CMD [ "pnpm", "run", "start:prod" ]

# docker build . -t tmp --target production

# Before manual running you should pass env variables to container: PORT, JWT_SECRET, MONGO_CONNECTION_STRING
# docker run --rm -d tmp

# Or use it
# docker run --env-file .env -p 8001:8001 --rm -d tmp