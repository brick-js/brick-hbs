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

    it('should handle extend tag', function() {
        var layout = 'before' + 'hbs-pending-block' + 'after';
        return hbs.render(path('home.hbs'), ctx, c => Promise.resolve(layout))
            .should.eventually.equal('before\n' + '<p>harttle</p>\n' + 'after');
    });
    it('should pass context to parent', function() {
        var pctrl = (mid, c) => Promise.resolve('hbs-pending-block' + mid + c.name);
        return hbs.render(path('home.hbs'), ctx, pctrl)
            .should.eventually.equal('\n' + '<p>harttle</p>\n' + 'layoutharttle');
    });
    it('should pass hash context to parent', function() {
        var pctrl = (mid, c) => Promise.resolve('hbs-pending-block' + mid + c.title);
        return hbs.render(path('account.hbs'), ctx, pctrl)
            .should.eventually.equal('\n' + '<p>harttle</p>\n' + 'layoutharttle');
    });
    it('should pass string hash context to parent', function() {
        var pctrl = (mid, ctx) => Promise.resolve('hbs-pending-block' + mid + ctx.name);
        return hbs.render(path('about.hbs'), ctx, pctrl)
            .should.eventually.equal('\n<p>harttle</p>\nlayoutharttle');
    });
});

function path(p) {
    return Path.resolve(__dirname, '../cases', p);
}

