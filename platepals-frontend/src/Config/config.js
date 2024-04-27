// config.js
import devConfig from './config.dev';
import prodConfig from './config.prod';

const env = process.env.NODE_ENV || 'development';

let config;
switch (env) {
  case 'production':
    config = prodConfig;
    break;
  case 'development':
  default:
    config = devConfig;
}

export default config;
