module.exports = (sequelize, Sequelize) => {
    const EmailTemplate = sequelize.define("tbl_manage_email_templates", {

        // tblAdminId: {
        //     type: Sequelize.INTEGER
        // },
        // constant: {
        //     type: Sequelize.STRING
        // },
        // type: {
        //     type: Sequelize.STRING
        // },
        subject: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        template: {
            type: Sequelize.STRING
        },
        emailStatus: {
            type: Sequelize.INTEGER
        }
    });
    return EmailTemplate;
};