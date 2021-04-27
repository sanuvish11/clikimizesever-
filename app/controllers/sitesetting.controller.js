const express = require('express');
const config = require("../config/auth.config");
const router = express.Router();
var db = require("../models");
var buffer = require('buffer');
var SiteSetting = db.sitesetting;
const Op = db.Sequelize.Op;
const multer = require('multer');
const { pathToFileURL } = require('url');
const { extname } = require('path');
const path = require("path");
const fs = require("fs");
var jwt = require("jsonwebtoken");

//logo upload 
var storage = multer.diskStorage({
    destination: "./public/logo/",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
var logo = multer({ storage: storage }).single('file');
//favicon icon upload


var storage = multer.diskStorage({
    destination: "./public/favicon/",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
var favphoto = multer({ storage: storage }).single('file');

//post route
//route site settings
router.post('/sitesetting', (req, res) => {
    // console.log(req.body);
    SiteSetting.create({
        siteName: req.body.siteName,
        adminEmail: req.body.adminEmail,
        siteLogo: req.body.siteLogo,
        faviconIcon: req.body.faviconIcon,
        formName: req.body.formName,
        formEmail: req.body.formEmail,
        siteNavigation: req.body.siteNavigation,
        fbLink: req.body.fbLink,
        twitterLink: req.body.twitterLink,
        googlePlus: req.body.googlePlus,
        linkedinLink: req.body.linkedinLink,
        smtpHost: req.body.smtpHost,
        smtpPort: req.body.smtpPort,
        smtpUserName: req.body.smtpUserName,
        smtpPassword: req.body.smtpPassword,
        googleRecaptaKey: req.body.googleRecaptaKey,
        googleRecaptaSecretKey: req.body.googleRecaptaSecretKey,
        footerCopyRight: req.body.footerCopyRight,
        footerLogo: req.body.footerLogo,
        currencySign: req.body.currencySign,
        pricePlatFormManageService: req.body.pricePlatFormManageService,
        stripeCurrency: req.body.stripeCurrency,
        stripeApiId: req.body.stripeApiId,
        stripeSecretKey: req.body.stripeSecretKey,
        metaKeyword: req.body.metaKeyword,
        metaDescrtiption: req.body.metaDescrtiption,
    }).then(site => {
        res.send({
            status: 1,
            message: "create site setting successfully"
        });
    })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unble to proceess"
            });
        });
})

//update settings
router.post('/update', (req, res) => {
    const id = req.body.id;

    // console.log(id)
    SiteSetting.update(
        req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "site setting  was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update site setting with id=${id}. Maybe site setting was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
});

//update logo
router.post('/updatelogo', logo, (req, res) => {
    const id = req.body.id;
    SiteSetting.update(
        { siteLogo: req.file.filename }, {
        where: { id: id }
    })
        .then(num => {

            if (num == 1) {
                res.send({
                    status: 1,
                    message: "site logo updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update site logo  with id=${id}. Maybe site logo was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
});

//update favicon icon
router.post('/favicon', favphoto, (req, res) => {
    const id = req.body.id;
    //console.log(req.file)
    SiteSetting.update(
        { faviconIcon: req.file.filename }, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "site favicon icon updated successfully."

                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update site favicon icon with id=${id}. Maybe site favicon icon was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
});

//get Routes
//get settings all records
router.get('/getsitesetting', (req, res) => {
    SiteSetting.findOne({
    })
        .then(site => {
            //  console.log(site.siteLogo)
            let siteData = {
                id: site.id,
                siteName: site.siteName,
                adminEmail: site.adminEmail,
                siteLogo: 'http://' + req.headers.host + '/logo/' + site.siteLogo,
                faviconIcon: 'http://' + req.headers.host + '/favi/' + site.faviconIcon,
                formName: site.formName,
                formEmail: site.formEmail,
                siteNavigation: site.siteNavigation,
                fbLink: site.fbLink,
                twitterLink: site.twitterLink,
                googlePlus: site.googlePlus,
                linkedinLink: site.linkedinLink,
                smtpHost: site.smtpHost,
                smtpPort: site.smtpPort,
                smtpUserName: site.smtpUserName,
                smtpPassword: site.smtpPassword,
                googleRecaptaKey: site.googleRecaptaKey,
                googleRecaptaSecretKey: site.googleRecaptaSecretKey,
                footerCopyRight: site.footerCopyRight,
                footerLogo: site.footerLogo,
                currencySign: site.currencySign,
                pricePlatFormManageService: site.pricePlatFormManageService,
                stripeCurrency: site.stripeCurrency,
                stripeApiId: site.stripeApiId,
                stripeSecretKey: site.stripeSecretKey,
                metaKeyword: site.metaKeyword,
                metaDescrtiption: site.metaDescrtiption,
            }

            if (siteData.length != 0) {
                res.json({
                    status: 1,
                    siteData: siteData
                })
            }
            else {
                res.json({
                    status: 4,
                    message: "no record found"
                })
            }
        }).catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proceess"
            });
        })
})

//setting get token
router.get('/getSettingsToken', (req, res) => {
    var token = jwt.sign({ id:1 }, config.secret, {
        //  algorithm: 'RS256',
        expiresIn: 10 * 60 * 1000,
        // 24 hours
    })
    res.send({
        sitetoken: token
    })
})

module.exports = router


