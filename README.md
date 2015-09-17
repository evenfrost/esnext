## Description
Includes:
* [Koa](http://koajs.com/)
* [jspm](http://jspm.io/)
* [Babel](https://babeljs.io/)
* [Gulp](http://gulpjs.com/)
* [Jade](http://jade-lang.com/)
* [Stylus](http://learnboost.github.io/stylus/)

## Installation and Usage
Node.js 4.0.0 or higher is required for this boilerplate to run, as well as globally installed jspm, Gulp and Babel.
    
    $ git clone git@github.com:evenfrost/esnext.git
    $ cd esnext
    $ npm install
    $ jspm install
    $ gulp

While in development mode, on server unstable V8 ES.next features are transpiled at runtime with `babel-node`, while stable (e.g. generators) are handled by Node.js itself.
On client everything is managed by jspm. ([See jspm wiki.](https://github.com/jspm/jspm-cli/wiki)) 

## Production workflow
    $ gulp build
    $ NODE_ENV=production node build/index.js

All processed files are placed in `build` folder, preserving the abovementioned stable/unstable logic, with client scripts and styles bundled respectively in separate files.
