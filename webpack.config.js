const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "assert": require.resolve("assert/"),
      "url": require.resolve("url/")
    }
  },
  // other Webpack config options...
};