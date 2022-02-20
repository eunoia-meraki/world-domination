FROM node:17.4.0-alpine

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY ./server/ ./server_proj
COPY ./webapp ./webapp_proj


RUN npm install -g pnpm \
&& cd ./webapp_proj && pnpm install && pnpm prod:build \
&& cd .. \
&& rm -rf ~/.pnpm-store/ \
&& cd ./server_proj && pnpm install && pnpm prod:build \
&& cd .. \
&& mkdir dist \
&& cp -r ./server_proj/dist/* ./dist && cp -r ./webapp_proj/build/* ./dist/clientApp \
&& mv ./server_proj/node_modules ./ \
&& rm -rf server_proj && rm -rf webapp_proj

# Run app
CMD [ "node", "./dist/index.js" ]
