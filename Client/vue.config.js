const path = require('path');

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/styles/variables.styl'),
      ],
    });
}

module.exports = {
  lintOnSave: false,
  pwa: {
    name: 'mHome',
    themeColor: '#00c0a3',
    msTileColor: '#00c0a3',
  },
  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) => addStyleResource(config.module.rule('stylus').oneOf(type)));
  },
};
