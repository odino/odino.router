var router = require('../lib/router');
var should = require('should');

describe('router', function(){
    describe('#imatch()', function(){
        it('should match a raw path', function(){
            var exampleRoute = {
                path: '/example'
            };

            router.match(exampleRoute, { url: '/example' }).should.be.true;
            exampleRoute.resolution.should.be.eql("exact");
        }),
        it('should not match if the HTTP method is not correct', function(){
            var exampleRoute = {
                path: '/example',
                methods: ['GET']
            };

            router.match(exampleRoute, { url: '/example', method: 'POST' }).should.be.false;
        }),
        it('should match if the HTTP method is correct', function(){
            var exampleRoute = {
                path: '/example',
                methods: ['GET', 'POST']
            };

            router.match(exampleRoute, { url: '/example', method: 'POST' }).should.be.ok;
        }),
        it('should matche a path with parameters', function(){
            var exampleRoute = {
                path: '/hello/:name'
            };

            router.match(exampleRoute, { url: '/hello/alex-nadalin' }).should.be.true;
            exampleRoute.resolution.should.be.eql("regex");
            exampleRoute.parameters.name.should.be.eql("alex-nadalin");
        }),
        it('should match a path with multiple parameters', function(){
            var exampleRoute = {
                path: '/hello/:name-:lastname/and:end'
            };

            router.match(exampleRoute, { url: '/hello/alex-nadalin/andfinal' }).should.be.true;
            exampleRoute.resolution.should.be.eql("regex");
            exampleRoute.parameters.name.should.be.eql("alex");
            exampleRoute.parameters.lastname.should.be.eql("nadalin");
            exampleRoute.parameters.end.should.be.eql("final");
        }),
        it('cannot match a path with concatenated parameters', function(){
            var exampleRoute = {
                path: '/hello/:name:lastname'
            };

            try {
                router.match(exampleRoute, { url: '/hello/alexnadalin' }).should.be.false;
            } catch (err) {
                err.message.should.eql('matched route with path "/hello/:name:lastname", but an empty parameter was detected (:lastname), this might mean that you mispelled one of your router, concatenating parameters (ie. /:one:two)');
            }

        })
    })
})