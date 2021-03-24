module.exports = (sequelize, Sequelize) => {
    const ManageAbuseKeyword = sequelize.define("tbl_manage_abuse_keywords", {
        tblAdminId: {
            type: Sequelize.INTEGER
        },
        abuseKeyword: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    return ManageAbuseKeyword;
};


