// config.js
const config=require('./config');
module.exports = {
    jwt: {
      privateKey:config.private_key,
      publicKey:config.publicKey
    }
  };
  