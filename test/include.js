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

describe('include tag', function() {
    var root = Path.resolve(__dirname, '../cases'),
        hbs = Hbs(),
        user = { name: 'harttle' };

    it('should handle include tag', function() {
        return hbs.render(path('navbar.hbs'), {}, c => Promise.resolve('user'))
            .should.eventually.equal('before' + 'user' + 'after\n');
    });
    it('should inherit parent context', function() {
        return hbs.render(path('navbar.hbs'), user, render)
            .should.eventually.equal('before<p>harttle</p>\nafter\n');
    });
    it('should accept hash context', function() {
        return hbs.render(path('user-list.hbs'), { user: user}, render)
            .should.eventually.equal('<p>harttle</p>\n\n');
    });
    it('should accept string hash context', function() {
        return hbs.render(path('user-array.hbs'), {}, render)
            .should.eventually.equal('<p>harttle</p>\n\n');
    });
    function render(mid, ctx){
        return hbs.render(path(`${mid}.hbs`), ctx, render);
    }
});

function path(p) {
    return Path.resolve(__dirname, '../cases', p);
}

