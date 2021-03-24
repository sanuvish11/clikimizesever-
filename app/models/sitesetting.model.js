module.exports = (sequelize, Sequelize) => {
    const SiteSetting = sequelize.define("tbl_site_settings", {

        siteName: {
            type: Sequelize.STRING
        },
        adminEmail:{
            type: Sequelize.STRING
        },
        siteLogo:{
            type: Sequelize.STRING
        },
        faviconIcon:{
            type: Sequelize.STRING
        },
        formName:{
            type: Sequelize.STRING
        },
        formEmail:{
            type: Sequelize.STRING
        },
        siteNavigation:{
            type: Sequelize.STRING
        },
        fbLink:{
            type: Sequelize.STRING
        },
        twitterLink:{
            type: Sequelize.STRING
        },
        googlePlus:{
            type: Sequelize.STRING
        },
        linkedinLink:{
            type: Sequelize.STRING
        },
        smtpHost:{
            type: Sequelize.STRING
        },
        smtpPort:{
            type: Sequelize.STRING
        },
        smtpUserName:{
            type: Sequelize.STRING
        },
        smtpPassword:{
            type: Sequelize.STRING
        },
        googleRecaptaKey:{
            type: Sequelize.STRING
        },
        googleRecaptaSecretKey:{
            type: Sequelize.STRING
        },
        footerCopyRight:{
            type: Sequelize.STRING
        },
        footerLogo:{
            type: Sequelize.STRING
        },
        currencySign:{
            type: Sequelize.STRING
        },
        pricePlatFormManageService:{
            type: Sequelize.STRING
        },
        stripeCurrency:{
            type: Sequelize.STRING
        },
        stripeApiId:{
            type: Sequelize.STRING
        },
        stripeSecretKey:{
            type: Sequelize.STRING
        },
        metaKeyword:{
            type: Sequelize.STRING
        },
        metaDescrtiption:{
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
          },
          name: {
            type: Sequelize.STRING
          },
          data: {
            type: Sequelize.BLOB('long')
          }      
    });
    return SiteSetting;
};

