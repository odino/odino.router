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
            var fx = _s.sprintf('matchBy%s', _s.capitalize(method));
            if (self[fx](route, request) == true) {
                route.resolution = method;

                return method;
            }
        });

        return matches;
    },
    matchByExact: function(route, request) {
        return route.path == request.url;
    },
    matchByRegex: function(route, request) {
        var result;
        var regex       = /(:[a-z]{1,})/g
        var parameters  = route.path.match(regex, route.path);
        var routeRegex  = route.path.replace(regex, "(.*)");

        route.parameters = {};

        if (result = request.url.match(routeRegex)) {
            delete result['index']
            delete result['input']
            var result = result.splice(1, 3)

            _.each(parameters, function(parameter, index){
                parameter = parameter.replace(':', '');
                route.parameters[parameter] = result[index];
            });

            return true
        }
    }
}

module.exports = router;