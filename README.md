[![NPM version](https://img.shields.io/npm/v/brick-hbs.svg?style=flat)](https://www.npmjs.org/package/brick-hbs)
[![Build Status](https://travis-ci.org/brick-js/brick-hbs.svg?branch=master)](https://travis-ci.org/brick-js/brick-hbs)
[![Coverage Status](https://coveralls.io/repos/github/brick-js/brick-hbs/badge.svg?branch=master)](https://coveralls.io/github/brick-js/brick-hbs?branch=master)
[![Dependency manager](https://david-dm.org/brick-js/brick-hbs.png)](https://david-dm.org/brick-js/brick-hbs)

Handlebars Template Engine for [Brick.js][brk].

## Run the Demo

`demo/` directory contains a demo project. Run the demo:

```bash
git clone git@github.com:brick-js/brick-hbs.git
cd brick-hbs && npm install
cd demo && npm install
grunt
```

Open http://localhost:3000 in your browser!

## Installation

```bash
npm install -S brick-hbs
```

## Set template engine for brick.js

```javascript
var brickJs = require('brick.js');
var Hbs = require('brick-hbs');

var brk = brickJs({
    view: ['view.hbs', 'view.html']
});

var hbs = Hbs.brick({
    cache: false    // disabled by default, see below
})
brk.engine('.hbs', hbs);     // set hbs engine for .hbs file
brk.engine('.html', hbs);    // set hbs engine for .html file

app.use('/', brk.express);
```

## Include Partials/Modules

In Brick.js, partials are organized as modules. Eg:

File `footer/view.hbs` in module `footer`:

```html
<footer> Powered by Brick.js </footer>
```

File `home/view.hbs` in module `home`:

```html
<html>
<body>
  <p>Demo Page</p>
  {{include 'footer'}}
</body>
</html>
```

The HTML for `home` page will be rendered as:

```html
<html>
<body>
  <p>Demo Page</p>
  <footer> Powered by Brick.js </footer>
</body>
</html>
```

## Layout Extend 

Brick-hbs implemented async helper internaly, to support layout extend. Eg: 

File `layout1/view.html` in module `layout1`:

```html
<html>
<title>Common Title</title>
<body>
  {{{block}}}
</body>
</html>
```

> Use `{{block}}` for escaping.

File `home/view.hbs` in module `home`:

```html
{{extend 'layout1'}}
<p> Contents for home page </p>
```

The HTML for `home` page will be rendered as:

```html
<html>
<title>Common Title</title>
<body>
  <p> Contents for home page </p>
</body>
</html>
```

## Options

### cache

Type: `Bool`

Default: `false`

If set to `true`, all templates will be loaded only once (for production usage). Otherwise, template file will be reloaded on every HTTP request.

## Register New Helper

Above declared `Hbs` object is compatible with [Handlebars][Handlebars].

Javascript:

```javascript
Hbs.registerHelper('upperCase', function(content) {
    return content.toUpperCase();
});
```

Template:

```handlebars
<h3>{{upperCase 'alice'}}</h3>
```

Will be rendered as:
 
```html
<h3>ALICE</h3>
```

[brk]: https://github.com/brick-js/brick-hbs
[Handlebars]: http://handlebarsjs.com/
