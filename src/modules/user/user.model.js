const sequelize = require('../../config/sql.config');
const Sequelize = require('sequelize');

const UserModel = sequelize.define('User', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            len: [8, 64]
        },
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: 'inactive',
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    activationToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    forgetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    forgetPasswordExpiry: {
        type: Sequelize.DATE,
        allowNull: true
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
    tableName: 'users'
})

module.exports = UserModel;