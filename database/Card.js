const Sequelize = require("sequelize");
const connection = require("./database");

const Card = connection.define('card', {
    json_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idList: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idBoard: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dateLastActivity: {
        type: Sequelize.DATE,
        allowNull: false
    },
    json: {
        type: Sequelize.JSON,
        allowNull: false
    }
});

Card.sync({force: false}).then (() => {});

module.exports = Card;