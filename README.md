# odino-router

A very simple and lightweight HTTP router.

## Usage

```
var router = require('./odino.router');
router.routes.push({
    path: '/hello/:what'
});

var route = router.resolve('/hello/world', request);

console.log(route.parameters.what); // world
```

## Declaring routes

A route is a plain object with a few properties:

* `pattern`, which defines the pattern that the path info of the request needs to match (it is the **only mandatory** property)
* `methods`, which defines which [HTTP methods](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) are
supported by the route
* `host`, which defines the host supported by the route

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

## Routing by HTTP method

By adding some methods, we restrict the possible matches:

```
route.methods = ["GET", "HEAD"];
```

Now our route will only match:

* `GET /example.com`
* `HEAD /example.com`

## Routing by host

Suppose you have an application running on multiple hosts (`api.example.org` and `example.org`), you can
define routes which will be only matched when the request is against one of the hosts:

```
route.host = "api.example.org";
```

## Tests

This library is somehow tested using mocha: after an `npm install` you can simply run `mocha` (or its verbose cousin
`./node_modules/mocha/bin/mocha`).