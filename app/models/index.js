const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
        operatorsAliases: false,
        //operatorsAliases: false,
        logging: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;

db.admin = require("../models/admin.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.sitesetting = require("../models/sitesetting.model.js")(sequelize, Sequelize);
db.package = require("../models/package.model.js")(sequelize, Sequelize);

db.packagedetail = require("../models/packageDetail.model.js")(sequelize, Sequelize);

db.userpackage = require("../models/userpackage.model.js")(sequelize, Sequelize);

db.managecontent = require("../models/managecontent.model.js")(sequelize, Sequelize);

db.emailtemplate = require("../models/emailtemplate.model.js")(sequelize, Sequelize);

db.manageabusekeyword = require("../models/abusekeyword.model.js")(sequelize, Sequelize);

db.transaction = require("../models/transaction.model.js")(sequelize, Sequelize);

db.packageType = require("../models/packageType.model.js")(sequelize, Sequelize);

db.manageblog = require("../models/blog.model.js")(sequelize, Sequelize);

db.managenewsletter = require("../models/newsletter.model.js")(sequelize, Sequelize);

db.contactus = require("../models/contactus.model.js")(sequelize, Sequelize);

db.like = require("../models/like.model.js")(sequelize, Sequelize);

db.reset = require("../models/reset.model.js")(sequelize, Sequelize);

db.privatemessage = require("../models/privatemessage.model.js")(sequelize, Sequelize);

db.notification = require("../models/notification.model.js")(sequelize, Sequelize);

db.addtofavorite = require("../models/addtofavorites.model.js")(sequelize, Sequelize);

db.template = require("../models/template.model.js")(sequelize, Sequelize);

db.website = require("../models/website.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.admin, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.admin.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

//db.packagedetail.belongsTo(db.admin);

db.like.belongsTo(db.user);

db.package.belongsTo(db.packageType);

db.packagedetail.belongsTo(db.packageType);

db.userpackage.belongsTo(db.user);

 db.userpackage.belongsTo(db.packagedetail);

db.transaction.belongsTo(db.user);

db.user.belongsTo(db.role);

db.manageabusekeyword.belongsTo(db.admin);



db.addtofavorite.belongsTo(db.user);

// db.manageblog.belongsTo(db.admin);

db.ROLES = ["user", "admin"];

module.exports = db;