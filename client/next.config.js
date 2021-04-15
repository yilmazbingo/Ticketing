module.exports = {
  // this file loaded up automatically by next js whenever our app starts up. next will call this webpackdevmiddleware with this config
  // poll all the different files inside of a project directory once every 300ms.
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
