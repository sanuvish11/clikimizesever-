const express = require('express');
const config = require("../config/auth.config");
const router = express.Router();
var jwt = require("jsonwebtoken");
var db = require("../models");
var SiteSetting = db.sitesetting;
const Op = db.Sequelize.Op;

router.get('/getSettingsToken', (req, res) => {
    SiteSetting.findOne({

    }).then(data => {
        var token = jwt.sign({ id: data.id }, config.secret, {
            //  algorithm: 'RS256',
            expiresIn: 10 * 60 * 1000,
            // 24 hours
        })
        var tokensite = token.replace(".", "124abcdkamal");
        res.send({
            accessToken: tokensite
        })
    })

})
module.exports = router
