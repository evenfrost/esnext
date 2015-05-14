## Description
Includes:
* [Koa](http://koajs.com/)
* [Jade](http://jade-lang.com/)
* [Stylus](http://learnboost.github.io/stylus/)
* [Gulp](http://gulpjs.com/)
* [Babel](https://babeljs.io/)
* [jspm](http://jspm.io/)

## Installation and Usage
[io.js](https://iojs.org/en/index.html) is required for this boilerplate to run, as well as globally installed jspm, Gulp and Babel compiler.
    
    $ git clone git@github.com:evenfrost/esnext.git
    $ cd esnext
    $ npm install
    $ jspm install
    $ gulp

## Production workflow
    $ gulp build
    $ NODE_ENV=production iojs build/index.js
