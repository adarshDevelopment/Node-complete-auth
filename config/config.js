const { sqlConfig } = require('../src/config/config');
// console.log('sqlConfig: ', sqlConfig);
const config = {
  development: {
    "username": sqlConfig.user,
    "password": sqlConfig.password,
    "database": sqlConfig.db,
    "host": sqlConfig.host,
    "dialect": sqlConfig.dialect
  },
  test: {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
module.exports = config;