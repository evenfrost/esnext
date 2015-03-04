'use strict';

import _ from 'lodash';
import window from 'github/fetch';

let request = function* (url) {
  let res = yield fetch(url),
      json = yield res.json();
};

let rit = request('/test');
console.log(rit.next());
