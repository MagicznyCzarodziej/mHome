const path = require('path');

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, './src/assets/styles/variables.styl')]
    });
}

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      modules: [path.resolve('./src'), path.resolve('./node_modules')],
      alias: {
        icons: path.resolve(__dirname, 'node_modules/vue-material-design-icons')
      },
      extensions: ['.vue']
    }
  },
  pwa: {
    name: 'mHome',
    themeColor: '#11181C',
    msTileColor: '#11181C'
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)));
  }
};
