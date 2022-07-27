# OpenAPI Typescript Codegen

[![NPM][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Coverage][coverage-image]][coverage-url]
[![Quality][quality-image]][quality-url]
[![Code Climate][climate-image]][climate-url]
[![Downloads][downloads-image]][downloads-url]
[![Build][build-image]][build-url]

> Node.js library that generates Typescript clients based on the OpenAPI specification.

## Why?

-   Frontend ❤️ OpenAPI, but we do not want to use JAVA codegen in our builds
-   Quick, lightweight, robust and framework-agnostic 🚀
-   Supports generation of TypeScript clients
-   Supports generation of react-query hooks (queries, mutations) for each operation
-   Supports fetch by default but switches to XHR (via dynamic import) when upload progress is needed
-   Supports OpenAPI specification v2.0 and v3.0
-   Supports JSON and YAML files for input
-   Supports generation through CLI, Node.js and NPX
-   Supports aborting of requests (via AbortController and AbortSignal)
-   Supports external references using [json-schema-ref-parser](https://github.com/APIDevTools/json-schema-ref-parser/)

## Install

```
npm install openapi-typescript-codegen --save-dev
```

## Usage

```
$ openapi --help

  Usage: openapi [options]

  Options:
    -V, --version             output the version number
    -i, --input <value>       OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>      Output directory (required)
    --exportCore              Write core files to disk (default: true)
    --exportServices          Write services to disk (default: true)
    --exportModels            Write models to disk (default: true)
    --exportHooks             Write react-query hooks to disk (default: false)
    --exportSchemas           Write schemas to disk (default: false)
    --indent <value>          Indentation options [4, 2, tab] (default: "4")
    --postfix <value>         Service name postfix (default: "Service")
    -h, --help                display help for command

  Examples
    $ openapi --input ./spec.json --output ./generated
    $ openapi --input ./spec.json --output ./generated --exportHooks --indent 2
```

# Documentation

-   [Basic usage](docs/basic-usage.md)
-   [OpenAPI object](docs/openapi-object.md)
-   [Client instances](docs/client-instances.md) `--name`
-   [Runtime schemas](docs/runtime-schemas.md) `--exportSchemas`
-   [Enum with custom names and descriptions](docs/custom-enums.md)
-   [Nullable props (OpenAPI v2)](docs/nullable-props.md)
-   [Authorization](docs/authorization.md)
-   [External references](docs/external-references.md)
-   [Canceling requests](docs/canceling-requests.md) -- TODO update

[npm-url]: https://npmjs.org/package/openapi-typescript-codegen
[npm-image]: https://img.shields.io/npm/v/openapi-typescript-codegen.svg
[license-url]: LICENSE
[license-image]: http://img.shields.io/npm/l/openapi-typescript-codegen.svg
[coverage-url]: https://codecov.io/gh/ferdikoomen/openapi-typescript-codegen
[coverage-image]: https://img.shields.io/codecov/c/github/ferdikoomen/openapi-typescript-codegen.svg
[quality-url]: https://lgtm.com/projects/g/ferdikoomen/openapi-typescript-codegen
[quality-image]: https://img.shields.io/lgtm/grade/javascript/g/ferdikoomen/openapi-typescript-codegen.svg
[climate-url]: https://codeclimate.com/github/ferdikoomen/openapi-typescript-codegen
[climate-image]: https://img.shields.io/codeclimate/maintainability/ferdikoomen/openapi-typescript-codegen.svg
[downloads-url]: http://npm-stat.com/charts.html?package=openapi-typescript-codegen
[downloads-image]: http://img.shields.io/npm/dm/openapi-typescript-codegen.svg
[build-url]: https://circleci.com/gh/ferdikoomen/openapi-typescript-codegen/tree/master
[build-image]: https://circleci.com/gh/ferdikoomen/openapi-typescript-codegen/tree/master.svg?style=svg
