const Sequelize = require("sequelize");
const connection = require("./database");

const Member = connection.define('member', {
    json_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    json: {
        type: Sequelize.JSON,
        allowNull: false
    }
});

// COMENTAR LINHA ABAIXO APÓS PRIMEIRA EXECUÇÃO
Member.sync({force: false}).then (() => {});

module.exports = Member;