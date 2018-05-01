'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api/"',
  BASE_URL: '"http://localhost/chc/"',
  BASE_TOTAL_API: '"http://localhost/chc-api/"',
  STATIC_URL: '"/static/UE/"'
})
