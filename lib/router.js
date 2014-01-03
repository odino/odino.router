var _  = require('underscore');
var _s = require('underscore.string');

var router = {
    routes: [],
    resolve: function(request, response) {
        this.request    = request;
        var self        = this;
        var match       = null;

        _.each(this.routes, function(route){
            if (self.match(route, request)) {
                match = route;
            }
        })

        return match;
    },
    match: function(route, request) {
        var self    = this;
        var result  = false;
        var methods = [
            'exact',
            'regex'
        ];

        var matches = _.some(methods, function(method){
            var matchUrl = _s.sprintf('matchBy%s', _s.capitalize(method));

            if (self[matchUrl](route, request) == true && self.matchMethod(route, request) == true) {
                route.resolution = method;

                return method;
            }
        });

        return matches;
    },
    matchMethod: function(route, request) {
        if (_.isArray(route.methods) && route.methods.indexOf(request.method) == -1) {
            return false;
        }

        return true;
    },
    matchByExact: function(route, request) {
        return route.pattern == request.url;
    },
    matchByRegex: function(route, request) {
        var result;
        var regex       = /(:[a-z]{1,})/g
        var parameters  = route.pattern.match(regex, route.pattern);
        var routeRegex  = route.pattern.replace(regex, "(.*)");

        route.parameters = {};

        if (result = request.url.match(routeRegex)) {
            delete result['index']
            delete result['input']
            var result = result.splice(1, 3)

            _.each(parameters, function(parameter, index){
                parameter = parameter.replace(':', '');
                var value = result[index];

                if (value) {
                    route.parameters[parameter] = value;
                } else {
                    var msg = _s.sprintf(
                        'matched route with pattern "%s", but an empty parameter was detected (%s), this might mean that you mispelled one of your router, concatenating parameters (ie. /:one:two)',
                        route.pattern,
                        ':' + parameter
                    );
                    throw new Error(msg);
                }
            });

            return true
        }
    }
}

module.exports = router;