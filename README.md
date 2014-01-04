# odino.router

[![NPM version](https://badge.fury.io/js/odino.router.png)](http://badge.fury.io/js/odino.router)
[![Build Status](https://travis-ci.org/odino/odino.router.png?branch=travis-ci)](https://travis-ci.org/odino/odino.router)
[![Dependency Status](https://gemnasium.com/odino/odino.router.png)](https://gemnasium.com/odino/odino.router)

A very simple and lightweight HTTP router.

## Usage

```
var routes = {
    example: {
        path: '/hello/:what'
    }
};
var router = require('./odino.router');

router.load(routes);

var route = router.resolve('/hello/world', request);

console.log(route.parameters.what); // world
```

## Declaring routes

A route is a plain object with a few properties:

* `pattern`, which defines the pattern that the path info of the request needs to match (it is the **only mandatory**
property and must be a string)
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

## Loading routes

You have 3 ways to load routes into your router, and all of them serve for a specific purpose:

### Direct loading

You can **directly set the routes object** when you want to reset the current routes:

```
var myFirstRoutes = {
    example: {
        pattern: '/hello/:what'
    }
};

router.load(myFirstRoutes)

// oh sheez, we made a mistake!

var mySecondRoutes = {
    example2: {
        pattern: '/hello2/:what'
    }
};

router.routes = myRoutes;

console.log(router.routes) // mySecondRoutes
```

Since you are directly overriding the route objects, this method makes sure that all the previous routes go to hell :)

### Loading routes on-the-fly

In the context of a web application, you might want to provide dynamic routes by adding or removing routes on-the-fly:
you can achieve this by using the `#load()` method, which takes an object as its argument:

```
var myFirstRoutes = {
    example: {
        pattern: '/hello/:what'
    }
};

router.load(myFirstRoutes)

// some logic

var mySecondRoutes = {
    example2: {
        pattern: '/hello2/:what'
    }
};

router.load(mySecondRoutes)

console.log(router.routes) // an object containing routes from both myFirstRoutes and mySecondRoutes
```

### Config file

When you have to clean up the mess, it's better to then use a simple configuration file for your routes:

```
example:
  pattern: "/hello/:what"
example2:
  pattern: "/hello2/:what"
```

and load it with the router itself:

```
router.loadFromFile('./path/to/my/routes.yml');
```

Internally, this method uses the `#load()` method after converting the YML content in a JS object.

## Tests

This library is somehow tested using mocha: after an `npm install` you can simply run `mocha` (or its verbose cousin
`./node_modules/mocha/bin/mocha`).