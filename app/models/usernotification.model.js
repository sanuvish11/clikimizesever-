
module.exports = (sequelize, Sequelize) => {
    const UserNotification = sequelize.define("tbl_user_notification", {
        tblUserId: {
            type: Sequelize.INTEGER
        },
        title:{
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        }
    })
    return UserNotification;
};
