module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  weapp: {},
  h5: {
    devServer: {
      host: 'localhost',
      proxy: {
        '/api':{
          target:'http://m.hanguda.com/'
        }
      }
    }
  }
}
