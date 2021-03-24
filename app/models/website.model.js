module.exports = (sequelize, Sequelize) => {
    const WebSite = sequelize.define("website", {
        templateId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        },
        packageDetailId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER
        },
        site_name:{
            type: Sequelize.STRING
        },
    });
    return WebSite;
};
