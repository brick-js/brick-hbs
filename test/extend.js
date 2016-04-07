var chai = require("chai");
var should = chai.should();
var Hbs = require('..').brick;
var Path = require('path');
var fs = require('fs');
chai.use(require("chai-as-promised"));

Object.defineProperty(
    Promise.prototype,
    'should',
    Object.getOwnPropertyDescriptor(Object.prototype, 'should')
);

describe('extend tag', function() {
    var root = Path.resolve(__dirname, '../cases');
    var hbs = Hbs();
    var ctx = {name: 'harttle'};

    it('should pass context to parent', function() {
        return hbs.render(path('home.hbs'), ctx, render)
            .should.eventually.equal('harttle\n<p>harttle</p>\n\n');
    });
    it('should pass hash context to parent', function() {
        return hbs.render(path('account.hbs'), ctx, render)
            .should.eventually.equal('harttle\n<p>harttle</p>\nharttle\n');
    });
    it('should pass string hash context to parent', function() {
        return hbs.render(path('about.hbs'), ctx, render)
            .should.eventually.equal('harttle\n<p>harttle</p>\nharttle\n');
    });
    function render(mid, ctx){
        return hbs.render(path(`${mid}.hbs`), ctx, render);
    }
});

function path(p) {
    return Path.resolve(__dirname, '../cases', p);
}

