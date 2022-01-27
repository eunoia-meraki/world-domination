FROM node:17.4.0-alpine

WORKDIR /app

COPY . .

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["sh", "./starter.sh"]