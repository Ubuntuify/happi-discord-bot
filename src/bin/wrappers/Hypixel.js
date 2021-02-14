const { Client } = require('hypixel-api-reborn');

module.exports = class HypixelAPI extends Client {
  constructor(key) {
    super(key, {
      cache: false,
    });
  }

  /* TODO: Implement Hypixel API addons and make it easier
  for coding with this API. */
};
