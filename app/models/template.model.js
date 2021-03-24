module.exports = (sequelize, Sequelize) => {
    const Template = sequelize.define("template", {

        template_id: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        order: {
            type: Sequelize.STRING
        },
        siteTemplateId: {
            type: Sequelize.STRING
        },
        iconPath: {
            type: Sequelize.STRING
        },
        thumbPath: {
            type: Sequelize.STRING
        },
        tabletIconPath: {
            type: Sequelize.STRING
        },
        mobileIconPath: {
            type: Sequelize.STRING
        },
        demoSiteUrl: {
            type: Sequelize.STRING
        },
        verticals: {
            type: Sequelize.STRING
        },
        colors: {
            type: Sequelize.STRING
        },
        isNew: {
            type: Sequelize.STRING
        },
        canBuildFromUrl: {
            type: Sequelize.STRING
        },
        exampleSites: {
            type: Sequelize.STRING
        },
        attributionLink: {
            type: Sequelize.STRING
        },
        isCommunity: {
            type: Sequelize.STRING
        },
        editSiteUrl: {
            type: Sequelize.STRING
        },
        hasBlog: {
            type: Sequelize.STRING
        },
        hasStore: {
            type: Sequelize.STRING
        },
        numOfPages: {
            type: Sequelize.STRING
        },
        isCustom: {
            type: Sequelize.STRING
        }
    });

    return Template;
};


// exampleSites     varchar(255)  latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// attributionLink  varchar(25)   latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// isCommunity      varchar(20)   latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// editSiteUrl      varchar(255)  latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// hasBlog          varchar(20)   latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// hasStore         varchar(20)   latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// numOfPages       varchar(20)   latin1_swedish_ci  YES(NULL)                   select, insert, update, references
// isCustom         varchar(20)   latin1_swedish_ci  YES(NULL)                   select, insert, update, references           
