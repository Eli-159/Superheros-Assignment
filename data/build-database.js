const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initModels = require('./models/init.js');

const superherosData = require('./import/superheroes.json');
const usersData = require('./import/users.json');
const forumData = require('./import/forum.json');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'superheroes.db',
    logging: false
});

const models = initModels(sequelize);

// Encrypts the passwords from the User Table
usersData.forEach(async user => {
    user.password = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS));
});

const forceSyncDatabase = async () => {
    await sequelize.sync({force: true});
    await models.superhero.bulkCreate(superherosData);
    await models.user.bulkCreate(usersData);
    await models.forum.bulkCreate(forumData);
    console.log('Database Built Successfully.');
}

forceSyncDatabase();