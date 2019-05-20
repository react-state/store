'use strict';

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
  module.exports = require('./bundles/immutablejsDataStrategy.min.umd.js');
} else {
  module.exports = require('./bundles/immutablejsDataStrategy.umd.js');
}