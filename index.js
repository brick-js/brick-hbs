var util = require('util');
var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')('brick-hbs:hbs');
var Handlebars = require('handlebars');
var defaultOptions = {
    cache: false,
};

function Slug(pctrl) {
    this.pctrl = pctrl;
    this.children = [];
    this.parent = undefined;
}

Slug.prototype.pending = function() {
    var linkTable = {};
    return Promise.all(this.children).then(results => {
        results.forEach(info => linkTable[info.id] = info.html);
        return linkTable;
    });
};

function Brick(config) {
    this.config = config;
    this.cache = {};
}

Brick.prototype.render = function(tplPath, ctx, pctrl) {
    ctx = ctx || {};
    if (typeof ctx !== 'object') {
        var msg = 'context is expected to be an object, encountered: ' + ctx;
        throw new Error(msg);
    }
    ctx.slug = new Slug(pctrl);
    return this.getTpl(tplPath)
        .then(tpl => link(tpl, ctx))
        .then(html => {
            var parent = ctx.slug.parent;
            if (parent) {
                parent.ctx.block = html;
                return pctrl(parent.mid, parent.ctx);
            } else return html;
        });
};

Brick.prototype.getTpl = function(tplPath) {
    if (this.config.cache) {
        var tpl = this.cache[tplPath];
        if (tpl) return Promise.resolve(tpl);
    }
    return src(tplPath)
        .then(src => Handlebars.compile(src))
        .then(tpl => this.cache[tplPath] = tpl);
};

Handlebars.registerHelper('include', function(mid, context, options) {
    if (arguments.length < 3) {
        options = context;
        context = null;
    }
    context = _.merge({}, this, context, options.hash);
    var slug = options.data.root.slug,
        id = uuid(),
        p = slug.pctrl(mid, context).then(html => ({
            id, html
        }));
    slug.children.push(p);
    return `placeholder-${id}`;
});

Handlebars.registerHelper('extend', function(mid, context, options) {
    if (arguments.length < 3) {
        options = context;
        context = null;
    }
    var ctx = _.merge({}, this, context, options.hash);
    var slug = options.data.root.slug;
    slug.parent = {
        mid, ctx
    };
    return '';
});

function link(tpl, ctx) {
    var html = tpl(ctx),
        hbs = ctx.slug;
    return hbs.pending()
        .then(lktbl =>
            html.replace(/placeholder-(\d+)/g, (expr, name) => lktbl[name] || expr));
}

function src(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, 'utf8', function(e, data) {
            return e ? reject(e) : resolve(data);
        });
    });
}

function uuid() {
    return Math.random().toString(10).substr(2);
}

Handlebars.brick = config => new Brick(_.defaults(config || {}, defaultOptions));
module.exports = Handlebars;
