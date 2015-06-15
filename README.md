## Description
Includes:
* [Koa](http://koajs.com/)
* [Jade](http://jade-lang.com/)
* [Stylus](http://learnboost.github.io/stylus/)
* [Gulp](http://gulpjs.com/)
* [Babel](https://babeljs.io/)
* [jspm](http://jspm.io/)

## Installation and Usage
[io.js](https://iojs.org/en/index.html) is required for this boilerplate to run, as well as globally installed jspm, Gulp and Babel.
    
    $ git clone git@github.com:evenfrost/esnext.git
    $ cd esnext
    $ npm install
    $ jspm install
    $ gulp

In development mode, on server unstable V8 ES.next features are transpiled at runtime with `babel-node`, while stable (e.g. generators) are handled by io.js itself.
On client, everything is managed by jspm. ([See jspm wiki](https://github.com/jspm/jspm-cli/wiki)) 

## Production workflow
    $ gulp build
    $ NODE_ENV=production iojs build/index.js

All scripts are built in `build` folder, preserving the abovementioned stable/unstable logic, with client scripts and styles bundled accordingly in separate files.
