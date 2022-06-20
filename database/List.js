const Sequelize = require("sequelize");
const connection = require("./database");

const List = connection.define('list', {
    json_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idBoard: {
        type: Sequelize.STRING,
        allowNull: false
    },
    json: {
        type: Sequelize.JSON,
        allowNull: false
    }
});

List.sync({force: false}).then (() => {});

module.exports = List;