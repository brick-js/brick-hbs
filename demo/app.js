var express = require('express');
var path = require('path');
var logger = require('morgan');
var brickJs = require('brick.js');
var Hbs = require('..');
var debug = require('debug')('demo:app');

// brick.js

Hbs.registerHelper('upperCase', function(content) {
    return content.toUpperCase();
});

var brk = brickJs({
    root: path.join(__dirname, 'modules'),
    engine: Hbs.brick()
});

// express.js 

var app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', brk.express);

module.exports = app;
