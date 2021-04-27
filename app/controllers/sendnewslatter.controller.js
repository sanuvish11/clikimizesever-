const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
let ejs = require('ejs');
const fetch = require('node-fetch');
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
var db = require("../models");

var sendnewslatter = db.sendnewslatter;
var managenewsletter = db.managenewsletter;
var EmailTemplate = db.emailtemplate;
var SiteSetting = db.sitesetting;
const Op = db.Sequelize.Op;
//POST ROUTE
// create send latters
router.post('/save', (req, res) => {
   //
   
  // console.log(req.body)

    // console.log(textContent)
    let list = [];
    sendnewslatter.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
    }).then(cont => {
        managenewsletter.findAll({

        }).then(data => {
            list = data;
            list.forEach((element) => {
                EmailTemplate.findOne({
                    where: {
                        id: 7
                    }
                }).then(response => {
                    SiteSetting.findOne({
                    }).then(site => {

                        var m = {
                            footerCopyRight: '' + site.footerCopyRight,
                            siteName: site.siteName,
                            siteLogo: 'http://' + req.headers.host + '/logo/' + site.siteLogo,
                            title: cont.title,
                            content: cont.content,
                        };
                        let template = ejs.compile(response.template, m);
                        let subject = cont.title;
                        // 
                        var msg = EmailBuilder.getUserRegisterUpMessage(req.body.content, subject);
                        //console.log(msg)
                        msg.to = element.email;
                      //  console.log(element.email);
                        var ser = new EmailService();
                        ser.sendEmail(msg, function (err, result) {
                            res.send({
                                status: 1,
                                message: "message send successfully"
                            });
                            //console.log("email send success")
                        })

                    })
                })

            })
        })

    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "unable to proceess"
        });
    });
})


//update abuse keyword  detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    sendnewslatter.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (req.body.status == 1){
            managenewsletter.findAll({

            }).then(data => {

                list = data;
                list.forEach((element) => {
                    EmailTemplate.findOne({
                        where: {
                            id: 7
                        }
                    }).then(response => {
                        SiteSetting.findOne({
                        }).then(site => {

                            var m = {
                                footerCopyRight: '' + site.footerCopyRight,
                                siteName: site.siteName,
                                siteLogo: 'http://' + req.headers.host + '/logo/' + site.siteLogo,
                                title: req.body.title,
                                content: req.body.content,
                            };
                            let template = ejs.compile(response.template, m);
                            let subject = req.body.title;
                            // 
                            var msg = EmailBuilder.getUserRegisterUpMessage(req.body.content, subject);
                            //console.log(msg)
                            msg.to = element.email;
                           // console.log(element.email);
                            var ser = new EmailService();
                            ser.sendEmail(msg, function (err, result) {
                                res.send({
                                    status: 1,
                                    message: "message send successfully"
                                });
                                //console.log("email send success")
                            })

                        })
                    })

                })
            })
        }
      else {
            res.send({
                status: 0,
                message: `Cannot update  with id=${id}. Maybe was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "unable to proceess"
        });
    });
});
//get route
//get all  abuse keyword
router.get('/getall', (req, res) => {
    sendnewslatter.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                data: data
            })
        }
        else {
            res.send({
                status: 4,
                message: "No Record Found"
            })
        }
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "unable to proccess"
        });
    });
})
//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    sendnewslatter.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Abuse Keyword was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot Abuse Keyword  with id=${id}. Maybe Abuse Keyword  was not found!`
                });
            }
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess=" + id
            });
        });
});
module.exports = router;