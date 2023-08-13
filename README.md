# restaurant-app API

API managment for [restarant-app](https://github.com/mtw-programmer/restaurant-app) project

## set up

```
$ npm install
```

## create config

```
$ mkdir config
$ cd config
```

- To create a config for developement mode:

  ```
  $ touch development.env
  ```

- To create a config for production mode:

  ```
  $ touch production.env
  ```

- To create a config for tests:

  ```
  $ touch test.env
  ```

### each config file should include all of the listed variables:

- APP_PORT - to specify express app listening port
- REQ_DOMAIN - to specify front-end domain
- DB_HOST - to specify mongoDB database domain (without port)
- DB_NAME - database name for our app
- DB_PORT - database port
- SERVER_DOMAIN - our application domain with port

## run application in development mode

```
$ npm run dev
```

## run application in production mode

```
$ npm run prod
```

## run tests

```
$ npm run test
```

## run docs

```
$ npm run dev
```

- [URL: {SERVER_DOMAIN}/docs](http://localhost:3001/docs)
