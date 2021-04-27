module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("tbl_message", {
        tblUserId: {
            type: Sequelize.INTEGER
        },
        message: {
            type: Sequelize.STRING
        },
        reply_message: {
            type: Sequelize.STRING
        }
    });
    return Message;
};