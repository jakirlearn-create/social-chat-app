module.exports = {
  webpack: function(config, env) {
    // Disable localStorage in webpack build process
    if (env === 'development') {
      config.plugins = config.plugins.filter(
        plugin => !(plugin.constructor.name === 'HtmlWebpackPlugin' && plugin.userOptions && plugin.userOptions.templateParameters)
      );
    }
    return config;
  }
};
