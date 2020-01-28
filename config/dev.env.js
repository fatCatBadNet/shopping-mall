var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV:'"development"',
  // API_ROOT:'"http://192.168.3.159:6784/v1"', //少秋IP
  // API_ROOT:'"http://192.168.3.163:6784/v1"', //郭敏IP
  // API_ROOT:'"http://192.168.3.140:6784/v1"', //叶先辉IP
  // API_ROOT:'"http://192.168.3.30:6784/v1"', //余周同IP
// API_ROOT:'"http://192.168.7.200:6784/v1"',
API_ROOT:'"http://192.168.7.200:6784/v1"',
// API_ROOT:'"http://tenant_api.youxins.com/v1"',
	H5_ROOT:'"https://tenant.youxins.com"'
});
