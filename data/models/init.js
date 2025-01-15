const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const _superhero = require('./superhero.js');
const _user = require('./user.js');
const _forum = require('./forum.js');

module.exports = (sequelize) =>  {
    // Initiate the Models
    const models = {
        superhero: _superhero(sequelize),
        user: _user(sequelize),
        forum: _forum(sequelize)
    }

    // Set up model relationships
    models.superhero.hasMany(models.forum, {
        foreignKey: 'superheroId'
    });
    models.forum.belongsTo(models.superhero, {
        foreignKey: 'superheroId'
    });

    models.user.hasMany(models.forum, {
        foreignKey: 'userId'
    });
    models.forum.belongsTo(models.user, {
        foreignKey: 'userId'
    });
    
    // Returns the created models
    return models;
}