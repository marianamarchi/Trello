const Sequelize = require("sequelize");
const connection = require("./database");

const API = connection.define('api', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    APIKey: {
        type: Sequelize.STRING,
        allowNull: false
    },
    APIToken: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idBoard: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

API.sync({force: false}).then (() => {});

module.exports = API;