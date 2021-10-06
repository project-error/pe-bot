# Project Error Bot

## Getting Started

This repositority uses Yarn as its package
manager of choice.

### Install Deps
```sh
yarn install
```
### Setup Env Variables 
```sh
cp .env.example .env && vi .env
```

### Run Development Server
```sh
yarn dev
```

### Prod Deployment

This repository is setup to use Docker for
production deployment.

To run the compose script, use the following command

```sh
sudo docker-compose up -d && sudo docker-compose logs pe-db_core --follow
```