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

## Declaring routes

A route is a plain object with a few properties:

* `pattern`, which defines the pattern that the path info of the request needs to match
* `methods`, which defines which [HTTP methods](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) are
supported by the route

For example, this is  a very simple route:

```
var route = {
    pattern: '/example.com'
};
```

which matches the following requests:

* `GET /example.com`
* `POST /example.com`
* `PUT /example.com`

and so on.

By adding some methods, we restrict the possible matches:

```
route.methods = ["GET", "HEAD"];
```

Now our route will only match:

* `GET /example.com`
* `HEAD /example.com`