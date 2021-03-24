module.exports = (sequelize, Sequelize) => {
    const ContactUs = sequelize.define("tbl_cantactus", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING
        },
        replyMessage: {
            type: Sequelize.STRING
        },
        mobileNumber: {
            type: Sequelize.STRING
        },

    });
    return ContactUs;
};