var router = require('../lib/router');
var should = require('should');

var reset = function() {
    router.routes = {};
}

describe('router', function(){
    beforeEach(function(done){
        router.routes = {}

        done();
    }),
    describe('#load()', function(){
        it('should load routes in config', function(){
            router.load({ example: { pattern: '/example' }});
            router.routes.should.be.eql({ example: { pattern: '/example' } });
        }),
        it('should merge routes if called multiple times', function(){
            router.load({ example: { pattern: '/example' }});
            router.load({ example2: { pattern: '/hello' }});
            router.routes.should.be.eql({ example: { pattern: '/example' }, example2: { pattern: '/hello' }});
        })
        it('should throw an error if trying to load a route without pattern', function(){
            try {
                router.load({ example: {}});
            } catch (err) {
                err.message.should.be.eql('route "example" is missing the "pattern" attribute');

                return;
            }

            throw new Error('should have thrown an error');
        }),
        it('should throw an error if trying to load a route and the pattern is an array', function(){
            try {
                router.load({ example: { pattern: [] }});
            } catch (err) {
                err.message.should.be.eql('the pattern of the route "example" must be a string (found [])');

                return;
            }

            throw new Error('should have thrown an error');
        }),
        it('should throw an error if trying to load a route and the pattern is an object', function(){
            try {
                router.load({ example: { pattern: {a: 'b'} }});
            } catch (err) {
                err.message.should.be.eql('the pattern of the route "example" must be a string (found {"a":"b"})');

                return;
            }

            throw new Error('should have thrown an error');
        })
    }),
    describe('#loadFromFile()', function(){
        it('should load routes in config from a YAML file', function(){
            router.routes = {};
            router.loadFromFile('./test/stub/ok_routes.yml');
            router.routes.should.be.eql({ example: { pattern: '/example' } });
        }),
        it('should not load routes in config from an empty YAML file', function(){
            router.routes = {};

            router.loadFromFile('./test/stub/empty_routes.yml');
            router.routes.should.be.eql({});
        })
    }),
    describe('#imatch()', function(){
        it('should match a raw path', function(){
            var exampleRoute = {
                pattern: '/example'
            };

            router.match(exampleRoute, { url: '/example' }).should.be.true;
            exampleRoute.resolution.should.be.eql("exact");
        }),
        it('should not match a raw path if the url partially matches the pattern', function(){
            var exampleRoute = {
                pattern: '/example'
            };

            router.match(exampleRoute, { url: '/example2' }).should.be.false;
        }),
        it('should not match if the HTTP method is not correct', function(){
            var exampleRoute = {
                pattern: '/example',
                methods: ['GET']
            };

            router.match(exampleRoute, { url: '/example', method: 'POST' }).should.be.false;
        }),
        it('should match if the HTTP method is correct', function(){
            var exampleRoute = {
                pattern: '/example',
                methods: ['GET', 'POST']
            };

            router.match(exampleRoute, { url: '/example', method: 'POST' }).should.be.ok;
        }),
        it('should matche a path with parameters', function(){
            var exampleRoute = {
                pattern: '/hello/:name'
            };

            router.match(exampleRoute, { url: '/hello/alex-nadalin' }).should.be.true;
            exampleRoute.resolution.should.be.eql("regex");
            exampleRoute.parameters.name.should.be.eql("alex-nadalin");
        }),
        it('should match a path with multiple parameters', function(){
            var exampleRoute = {
                pattern: '/hello/:name-:lastname/and:end'
            };

            router.match(exampleRoute, { url: '/hello/alex-nadalin/andfinal' }).should.be.true;
            exampleRoute.resolution.should.be.eql("regex");
            exampleRoute.parameters.name.should.be.eql("alex");
            exampleRoute.parameters.lastname.should.be.eql("nadalin");
            exampleRoute.parameters.end.should.be.eql("final");
        }),
        it('cannot match a path with concatenated parameters', function(){
            var exampleRoute = {
                pattern: '/hello/:name:lastname'
            };

            try {
                router.match(exampleRoute, { url: '/hello/alexnadalin' }).should.be.false;
            } catch (err) {
                err.message.should.eql('matched route with pattern "/hello/:name:lastname", but an empty parameter was detected (:lastname), this might mean that you mispelled one of your router, concatenating parameters (ie. /:one:two)');
            }
        }),
        it('should be able to match a request by host', function(){
            var exampleRoute = {
                pattern: '/hello',
                host:    'example.org'
            };

            router.match(exampleRoute, { url: '/hello', headers: { host: 'example.org' }}).should.be.true;
        }),
        it('should be able to not match a request by host', function(){
            var exampleRoute = {
                pattern: '/hello',
                host:    'example2.org'
            };

            router.match(exampleRoute, { url: '/hello', headers: { host: 'example.org' }}).should.be.false;
        })
    })
})