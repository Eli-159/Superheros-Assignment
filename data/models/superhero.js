const {Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Superhero', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        pop: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    });
};