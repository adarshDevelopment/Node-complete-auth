const sequelize = require('../../config/sql.config');
const Sequelize = require('sequelize');

const AuthModel = sequelize.define('Auth', {
    userId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    accessToken: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    refreshToken: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    maskedAccessToken: {
        allowNull: false,
        type: Sequelize.STRING
    },
    maskedRefreshToken: {
        allowNull: false,
        type: Sequelize.STRING
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
    }
}, {
    timestamps: true,
    tableName: 'auths'
})

module.exports = AuthModel;