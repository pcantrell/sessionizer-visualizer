module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].hash = true
      return args
    })
  },

  publicPath: '/sessionizer-visualizer/'
}
