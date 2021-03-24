module.exports = (sequelize, Sequelize) => {
    const resetPassword = sequelize.define("tbl_reset_password", {
        token: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        }
    });
    return resetPassword;
};