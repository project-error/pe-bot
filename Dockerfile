FROM node:14

WORKDIR /usr/src/pe-bot

COPY . .

# Can probably also do a --production flag here
RUN yarn install --frozen-lockfile

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/index.js"]