# restaurant-app API

API allowing to manage restaurant infrastructure.

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
- TOKEN_SECRET - secret for JWT authentication
- TOKEN_EXPIRATION - JWT expiresIn property

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

## documentation preview

- API endpoints

![dashboard](https://github.com/mtw-programmer/restaurant-app-api/blob/main/readme/docs/dashboard.png?raw=true)
![offer](https://github.com/mtw-programmer/restaurant-app-api/blob/main/readme/docs/offer.png?raw=true)
![product](https://github.com/mtw-programmer/restaurant-app-api/blob/main/readme/docs/product.png?raw=true)

- Schemas

![admin_schema](https://github.com/mtw-programmer/restaurant-app-api/blob/main/readme/docs/admin_schema.png?raw=true)
![offer_schema](https://github.com/mtw-programmer/restaurant-app-api/blob/main/readme/docs/offer_schema.png?raw=true)
![product_schema](https://github.com/mtw-programmer/restaurant-app-api/blob/main/readme/docs/product_schema.png?raw=true)
