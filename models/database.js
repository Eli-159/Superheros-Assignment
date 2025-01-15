const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const initModels = require('../data/models/init.js');

module.exports = class {
    constructor() {
        // Create a Sequelize instance
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './superheroes.db',
            logging: false
        });

        // Initiate the Models
        this.models = initModels(this.sequelize);

        // Creates an asynchronous function to wrap database authentication.
        const openDatabaseConn = async () => {
            // Authentcate the database
            await this.sequelize.authenticate();
        }

        // Calls the previously defined function
        openDatabaseConn();
        
    }

    createUser = (user) => {
        return new Promise((res, rej) => {
            this.models.user.create(user).then(data => {
                res(JSON.parse(JSON.stringify(data)))
            }).catch(rej);
        });
    }

    getUser = (id) => {
        return new Promise((res, rej) => {
            const where = {};
            if (typeof id == 'number') where.id = id;
            else if (typeof id == 'string') where.email = id;
            else return {};
            this.models.user.findOne({
                where: where,
                raw: true
            }).then(data => {
                res(JSON.parse(JSON.stringify(data)));
            }).catch(rej);
        });
    }

    createForumPost = (post) => {
        return new Promise((res, rej) => {
            this.models.forum.create(post).then(data => {
                res(JSON.parse(JSON.stringify(data)))
            }).catch(rej);
        });
    }

    getForumPosts = (superheroId) => {
        return new Promise((res, rej) => {
            this.models.forum.findAll({
                attributes: {exclude: ['updatedAt']},
                include: [
                    {
                        model: this.models.user,
                        attributes: {exclude: ['createdAt', 'updatedAt', 'password']},
                        required: true,
                    }
                ],
                order: [['createdAt', 'ASC']],
                where: {
                    superheroId: superheroId
                }
            }).then(data => {
                res(JSON.parse(JSON.stringify(data)));
            }).catch(rej);
        });
    };

    topSuperheroes = (num) => {
        return new Promise((res, rej) => {
            this.models.superhero.findAll({
                attributes: {exclude: ['createdAt', 'updatedAt']},
                order: [['pop', 'DESC']],
                limit: num
            }).then(data => {
                res(JSON.parse(JSON.stringify(data)));
            }).catch(rej);
        });
    };

    incSuperheroPop = (id) => {
        return new Promise((res, rej) => {
            this.models.superhero.findAll({
                attributes: ['pop'],
                where: {
                    id: id
                }
            }).then(data => {
                console.log(JSON.parse(JSON.stringify(data)));
                this.models.superhero.update({
                    pop: JSON.parse(JSON.stringify(data))[0].pop+1
                }, {
                    where: {
                        id: id
                    }
                });
            }).catch(rej);
        });
    }
}