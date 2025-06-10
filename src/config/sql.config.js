const Sequelize = require('sequelize');
const { sqlConfig } = require('./config');

const sequelize = new Sequelize(sqlConfig.db, sqlConfig.user, sqlConfig.password, {
    host: sqlConfig.host,
    dialect: sqlConfig.dialect
});

(async () => {
    try {
        await sequelize.authenticate();
    } catch (exception) {
        // throw exception;
        // console.log(exception);
    }
})();


module.exports = sequelize;