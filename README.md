# Fiu Fit Back Setup

## Requirements
* Install PostgreSQL
* Install Node 16
  ```bash
  nvm install
  nvm alias default 16
  ```
* Install yarn
  ```bash
  npm install -g yarn
  ```

## Setup

### Backend setup

* Create the `.env` file on each of the `./app` directory projects to store all the environment variables. You can use the `./app/backend/.env.template` as a template.
* Run `yarn build` in the `./app/backend` directory to build the backend service.
* Run `yarn createdb` to create the database for the backend service.
* Run `yarn restartdb` to run all migrations and seeders for the backend service.
* Run `yarn start` to start the backend service on port `8080`.

## Installing dependencies

Simply run `yarn` on the `root` directory of the project.

### Running apps

To run any app in the project, you can use `yarn start` in the corresponding app directory.

