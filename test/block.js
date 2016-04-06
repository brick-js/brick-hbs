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

describe('block tag', function() {
    var root = Path.resolve(__dirname, '../cases');
    var hbs = Hbs();
    var ctx = {name: 'harttle'};

    it('should handle block tag', function() {
        var result = 'before' + 'hbs-pending-block' + 'after\n';
        return hbs.render(path('layout.hbs'))
            .should.eventually.equal(result);
    });
});

function path(p) {
    return Path.resolve(__dirname, '../cases', p);
}

