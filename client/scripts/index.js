'use strict';

import _ from 'lodash';
import window from 'github/fetch';

fetch('/test')
  .then((res) => {
    return res.text();
  })
  .then((text) => {
    console.log(text);
  });
