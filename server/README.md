# Development
```bash
npm i -g @nestjs/cli

nest new world-domination-server

npm i @nestjs/graphql graphql@^15 apollo-server-express apollo-server-core

npm install --save @nestjs/mongoose mongoose

npm install cross-env

@nestjs/jwt

npm i bcryptjs
```
### Installation

```bash
npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
# Deployment on Heroku is automated
Just push changes into main branch, server subdirectory
# MANUAL Deploy on Heroku
+ Download heroku cli
+ Download docker
+ Prepare node src files.
+ Configure getting port from ```process.env.PORT```, because of Heroku provides a random port through env vars and kills application if it do not take it during 60 secs.
+ Prepare Dockerfile (check build locally)
```sh
# Useful commands for testing

# yours images
docker images

# delete image
docker rmi {image id}

#cyours containers
docker ps -a

# delete container
docker rm {container id}

# kill active container
docker kill {container id}

# create self-destructive container with interactive shell access
docker run --rm -it {image id} sh

# attach running container with interactive shell access
docker exec -it {container id} sh

# create container with forwarded ports
docker run -d -p {host port}:{container port} {image id}

```
+ Container must be configured
+ Commands for manual first deploying
```sh
heroku login
heroku apps:create world-domination-server

# do this for (re)deploying
heroku container:login
heroku container:push web --app world-domination-server
heroku container:release web --app world-domination-server

# usefull commands
heroku open --app world-domination-server
heroku logs --tail
```
+ Application must have access to MongoDB server