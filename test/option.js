var chai = require("chai");
var should = chai.should();
var Hbs = require('..').brick;
var Path = require('path');
var fs = require('fs');
chai.use(require("chai-as-promised"));
var tmp = '/tmp/brick-hbs-test.hbs';

Object.defineProperty(
    Promise.prototype,
    'should',
    Object.getOwnPropertyDescriptor(Object.prototype, 'should')
);

describe('options', function() {
    it('should allow empty config', function() {
        var hbs = Hbs();
        var p = Path.resolve(__dirname, '../cases/user.hbs');
        return hbs.render(p, {
                name: 'harttle'
            })
            .should.eventually.equal('<p>harttle</p>\n');
    });
    it('should respect cache:true', function() {
        var hbs = Hbs({
            cache: true
        });
        fs.writeFileSync(tmp, '{{ name }}', 'utf-8');

        return hbs.render(tmp, {
                name: 'harttle'
            })
            .then(x => fs.writeFileSync(tmp, 'before{{ name }}', 'utf-8'))
            .then(x => hbs.render(tmp, {
                name: 'harttle'
            }))
            .should.eventually.equal('harttle');
    });
    it('should respect cache:false', function() {
        var hbs = Hbs({
            cache: false
        });
        fs.writeFileSync(tmp, '{{ name }}', 'utf-8');

        return hbs.render(tmp, {
                name: 'harttle'
            })
            .then(x => fs.writeFileSync(tmp, 'before{{ name }}', 'utf-8'))
            .then(x => hbs.render(tmp, {
                name: 'harttle'
            }))
            .should.eventually.equal('beforeharttle');
    });
});

