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

ARG PORT=8001
ARG MONGO_CONNECTION_STRING=mongodb+srv://gasame6865:dtNWMqfU@cluster0.0u67a.mongodb.net/wd_prod
ARG JWT_SECRET=ToPsEcReT

ENV PORT=${PORT}
ENV MONGO_CONNECTION_STRING=${MONGO_CONNECTION_STRING}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=production

WORKDIR /app

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json

# Run app
CMD [ "npm", "run", "start:prod" ]

# docker build . -t tmp --target production
# docker run --rm -it tmp sh