module.exports = (sequelize, Sequelize) => {
    const ManageContent = sequelize.define("tbl_manage_content", {
        pageTitle: {
            type: Sequelize.STRING
        },
        pageSlug: {
            type: Sequelize.STRING
        },
        metaKeyword: {
            type: Sequelize.STRING
        },
        metaDescription: {
            type: Sequelize.STRING
        },
        linkType: {
            type: Sequelize.STRING
        },
        pageDescription: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        }

    });
    return ManageContent;
};
