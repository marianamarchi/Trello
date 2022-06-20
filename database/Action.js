const Sequelize = require("sequelize");
const connection = require("./database");

const Action = connection.define('action', {
    json_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idMemberCreator: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idList: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    idCard: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idBoard: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idList: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idMember: {
        type: Sequelize.STRING,
        allowNull: false
    },
    json: {
        type: Sequelize.JSON,
        allowNull: false
    }
});

// COMENTAR LINHA ABAIXO APÓS PRIMEIRA EXECUÇÃO
Action.sync({force: false}).then (() => {});

module.exports = Action;