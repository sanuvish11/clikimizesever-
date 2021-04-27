module.exports = (sequelize, Sequelize) => {
    const MessageHistory = sequelize.define("tbl_message_history", {
        indox_id: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING
        },
        to:{
            type: Sequelize.STRING
        },
        from: {
            type: Sequelize.STRING
        }
    });
    return MessageHistory;
};