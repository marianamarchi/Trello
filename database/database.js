const Sequelize = require('sequelize');

const connection = new Sequelize('DATABASE', 'USUARIO', 'SENHA', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;