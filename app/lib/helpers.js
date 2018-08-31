// Helpers for various tasks
// Dependencies

const crypto = require('crypto');
const config = require('./config');

const helpers = {};

helpers.hash = (string) => {
  if (typeof(string) === 'string' && string.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
    return hash;
  } else {
    return false;
  }
}

helpers.parseJsonToObject = (string) => {
  try {
    const object = JSON.parse(string);
    return object;
  } catch (error) {
    return {};
  }
}
module.exports = helpers;
