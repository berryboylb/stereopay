## Instruction

```bash
$ create an env file

$ copy and paste from env.example file  to the env file

$ populate the data in the file, do not worry the migrations automatically works

$ run yarn install in the root directory

$ optionally, you can disable the logs in the app.module.ts, if the output are too much.
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Enpoints

```bash

(action)             (verb)    (URI)                               (argument(s))                                  (type of argument)
create:              POST      - /v1/media                         name, description and media(compulosry)        Body
list:                GET       - /v1/media                         page and perpage (optional)                    Query
details:             GET       - /v1/media/:id                     id(compulsory)                                 Param
details:             GET       - /v1/media/search                  query(compulsory)                              Query
update:              PATCH     - /v1/media/:id                     id and query (compulsory)                      Query and Param
delete:              DELETE    - /v1/media/:id                     id(compulosry)                                 Param

```

## Support

Nest is an MIT-licensed open source project.

## License

Nest is [MIT licensed](LICENSE).
