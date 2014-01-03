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
            })
    })
})