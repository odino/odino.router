# odino-router

A very simple and lightweight HTTP router.

## Usage

```
var router = require('./odino.router');
router.routes.push({
    path: '/hello/:what'
});

var route = router.resolve('/hello/world', request);

console.log(route.parameters.what);
```