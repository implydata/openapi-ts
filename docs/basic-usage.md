# Basic usage

```
$ openapi --help

  Usage: openapi [options]

  Options:
    -V, --version              output the version number
    -i, --input <value>        OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>       Output directory (required)
    --exportCore <value>       Write core files to disk (default: true)
    --exportClients <value>    Write clients to disk (default: true)
    --exportModels <value>     Write models to disk (default: true)
    --exportOperations <value> Write operation request/response types to disk (default: false)
    --exportSchemas <value>    Write schemas to disk (default: false)
    --indent <value>           Indentation options [4, 2, tab] (default: "4")
    --postfix <value>          Service name postfix (default: "Service")
    -h, --help                 display help for command

  Examples
    $ openapi --input ./spec.json --output ./generated
```

## Example

**package.json**

```json
{
    "scripts": {
        "generate": "openapi --input ./spec.json --output ./generated"
    }
}
```

**NPX**

```
npx openapi-typescript-codegen --input ./spec.json --output ./generated
```

**Node.js**

```javascript
const OpenAPI = require('openapi-typescript-codegen');

OpenAPI.generate({
    input: './spec.json',
    output: './generated',
});

// Or by providing the content of the spec directly 🚀
OpenAPI.generate({
    input: require('./spec.json'),
    output: './generated',
});
```
