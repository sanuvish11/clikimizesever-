
module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("tbl_notification", {
        title: {
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
        },
    })
    return Notification;
};
