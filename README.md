# Fiu Fit Back Setup

## Requerimientos
* PostgreSQL
* Node 16
  ```bash
  nvm install
  nvm alias default 16
  ```
* Yarn version 3
  ```bash
  npm install -g yarn
  
  yarn set version latest
  ```

## Setup

Seguir el `README.md` de cada app

## Instalando dependencias

Ejecutar `yarn build:common` y `yarn install` en el directorio root. 

### Ejecutando apps

Antes de ejecutar las apps, es **necesario** ejecutar de antemano el `service registry` y agregar la url de servicio en el archivo `.env` de cada app.

Para ejecutar cualquier app del proyecto, ejectuar `yarn start` en el directorio correspondiente de la app.

Tambien es posible ejecutar todas a la vez usando el comando `yarn start` en root.
