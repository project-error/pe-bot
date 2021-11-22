FROM node:14-alpine3.13
WORKDIR /usr/src/pe-bot
COPY . .
RUN apk add --no-cache \
    g++ \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Can probably also do a --production flag here
RUN yarn install --frozen-lockfile && yarn build

EXPOSE 3000

CMD ["node", "dist/index.js"]