# development stage
FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ecosystem.config.json ./

COPY ./src ./src

RUN ls -a

RUN yarn install --pure-lockfile && yarn compile

# production stage

FROM base as production

WORKDIR /usr/prod/app

COPY package.json yarn.lock ecosystem.config.json ./

RUN yarn global add pm2

RUN yarn install --production --pure-lockfile

COPY --from=base /usr/src/app/dist ./dist
