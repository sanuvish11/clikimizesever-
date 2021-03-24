module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("tbl_admins", {
    adminName: {
      type: Sequelize.STRING
    },
    adminEmail: {
      type: Sequelize.STRING
    },
    ipAddress: {
      type: Sequelize.STRING
    },
    adminPass: {
      type: Sequelize.STRING
    },
    profileImg: {
      type: Sequelize.STRING
    },
    adminType: {
      type: Sequelize.STRING
    },
    permissions: {
      type: Sequelize.INTEGER
    },

    isActive: {
      type: Sequelize.INTEGER
    },
    created_date: {
      type: 'TIMESTAMP',
      allowNull: false
    },
    updated_date: {
      type: 'TIMESTAMP',
      allowNull: false
    }


  }, {
    timestamps: true,
    createdAt: false,
    updatedAt: false
  });


  return Admin;
};
[
  {
    "id": 1,
    "siteName": "CLICKimizeÂ®",
    "adminEmail": "admin@clickimize.com",
    "siteLogo": "CLICKimizeÂ®",
    "formName": "CLICKimize",
    "formEmail": "CLICKimize",
    "siteNavigation": "",
    "fbLink": "https://www.facebook.com/clickimize/",
    "twitterLink": "https://twitter.com/clickimize",
    "googlePlus": "https://plus.google.com/+clickimize",
    "linkedinLink": "https://plus.google.com/+clickimize",
    "smtpHost": "ssl://smtp.gmail.com",
    "smtpPort": "465",
    "smtpUserName": "sanu@gmail.com",
    "smtpPassword": "shanooooo",
    "googleRecaptaKey": "hsabdhusabdbasb",
    "googleRecaptaSecretKey": "sajsndjasndsandasn",
    "footerCopyRight": "shanppp",
    "footerLogo": "yes",
    "currencySign": "$",
    "pricePlatFormManageService": "sadasdasd",
    "stripeCurrency": "doller",
    "stripeApiId": "shansnasanasn",
    "stripeSecretKey": "shanooooo",
    "metaKeyword": "sasasasasa",
    "metaDescrtiption": "sasd",
    "type": null,
    "name": null,
    "data": null,
    "createdAt": "2021-01-20T10:39:01.000Z",
    "updatedAt": "2021-01-20T10:39:01.000Z"
  }
]