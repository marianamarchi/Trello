const Sequelize = require('sequelize');

const connection = new Sequelize('trello', 'root', 'Lokinha7!', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;