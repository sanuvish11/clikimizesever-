const express = require("express");
const app = express();
const adminCtl = require("../controllers/admin.controller");
const siteCtl = require("../controllers/sitesetting.controller");
const userCtl = require("../controllers/user.controller");
const packageCtl = require("../controllers/package.controller");
const userpackageCtl = require("../controllers/userpackage.controller");
const packagedetailCtl = require("../controllers/packagedetail.controller");
const mananagcontentCtl = require("../controllers/mananagcontent.controller");
const emailtemplateCtl = require("../controllers/emailtemplate.controller");
const abusekeywordCtl = require("../controllers/abusekeyword.controller");
const transactionCtl = require("../controllers/transaction.controller");
const roleCtl = require("../controllers/role.controller");
const packageTypeCtl = require("../controllers/packageType.controller");
const blogCtl = require("../controllers/blog.controller");
const newsletterCtl = require("../controllers/newsletter.contoller");
const contactusCtl = require("../controllers/contactus.controller");
const likeCtl = require("../controllers/like.contoller");
const privatemessageCtl = require("../controllers/privatemessage.contoller");
const notificationCtl = require("../controllers/notification.controller");
const addtofavoriteCtl = require("../controllers/addtofavorite.controller");
const templateCtl = require("../controllers/template.contoller");
const websiteCtl = require("../controllers/website.controller");
const tokenCtl = require("../controllers/token.controller");
const { authJwt } = require("../middleware");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // ,[authJwt.verifyToken],
    app.use('/token', tokenCtl);
    app.use('/auth', adminCtl);
    app.use('/settings',[authJwt.verifyToken], siteCtl);
    app.use('/user',[authJwt.verifyToken], userCtl);
    app.use('/packagetype', [authJwt.verifyToken], packageTypeCtl);
    app.use('/packagedetail', [authJwt.verifyToken], packagedetailCtl);
    app.use('/manageContent', [authJwt.verifyToken], mananagcontentCtl);
    app.use('/email', [authJwt.verifyToken], emailtemplateCtl);
    app.use('/abuse', [authJwt.verifyToken], abusekeywordCtl);
    app.use('/blog',  blogCtl);
    app.use('/like', [authJwt.verifyToken], likeCtl);
    app.use('/newslatter', [authJwt.verifyToken], newsletterCtl);
    app.use('/contactus',  contactusCtl);
    app.use('/userpackage', [authJwt.verifyToken], userpackageCtl);
    app.use('/transaction', [authJwt.verifyToken], transactionCtl);
    app.use('/privateMessage', [authJwt.verifyToken], privatemessageCtl);
    app.use('/role', [authJwt.verifyToken], roleCtl);
    app.use('/notification', notificationCtl);
    app.use('/addtofavorite',  addtofavoriteCtl);
    app.use('/template',  templateCtl);
    app.use('/website', websiteCtl);
    app.use('/logo', express.static('public/logo'));
    app.use('/favi', express.static('public/favicon'));
    app.use('/profile', express.static('public/profile'));
    app.use('/blogImage', express.static('public/blogImage'));
    app.use('/images', express.static('public/blogData'));
   
};
// stripe accont test key node js server
// var Publishable_Key = 'pk_test_51IMtrpHOr6CjjjlH4iNgwrADRp9SAC2ChlhN0NV7snQUcHMEVpoBDu7YEgyOyd2lJSuSqXHg7pe2BzhXMFHTlk6Y00Pf5WOc5i'
// var Secret_Key = 'sk_test_51IMtrpHOr6CjjjlHeAbDmagCFqND6n79hz1UtQ6fEmKg5NY3dH26qkoMs4ePvpDlyPGImXilkqddcOQtRrY3gnaz00RaBZd16B'
// const stripe = require('stripe')(Secret_Key)