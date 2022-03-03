module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/desyn-unofficial-faucet/" : "/",
  transpileDependencies: [
    'vuetify'
  ]
}
