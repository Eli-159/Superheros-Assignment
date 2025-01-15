const {Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Forum', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING(10000)
        }
    })
};