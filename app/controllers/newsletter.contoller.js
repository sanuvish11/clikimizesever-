const express = require('express');
const config = require("../config/auth.config");
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
const router = express.Router();
var db = require("../models");
const { response } = require('express');
const ejs = require("ejs");
const { emailtemplate } = require('../models');
var EmailTemplate = db.emailtemplate;
var SiteSetting = db.sitesetting;
var ManageNewsLetter = db.managenewsletter;
var Notification = db.notification;
const Op = db.Sequelize.Op;
//POST ROUTE
// Create Manage News Latter
router.post('/save', (req, res) => {
    ManageNewsLetter.findOne({
        where: {
            email: req.body.email
        }
    }).then(news => {
        if (news) {
            res.send({
                status: 2,
                message: "Email Already Exits"
            });
            return;
        } else {
            ManageNewsLetter.create({
                email: req.body.email,
                status: req.body.status
            }).then(news => {
                var myJSON = {
                    id: news.id,
                    message: news.email
                }
                const myObjStr = JSON.stringify(myJSON);
        //  console.log(myObjStr);
                Notification.create({
                    title: "new subscriber Clickimize",
                    content: myObjStr,
                    type: "subscriber",
                    status: 1
                }).then(data => {

                    EmailTemplate.findOne({
                        where: {
                            id: 2
                        }
                    }).then(response => {
                 //   console.log(response.subject);
                        SiteSetting.findOne({}).then(site => {
                            var m = {
                                twitterLink: site.twitterLink,
                                googlePlus: site.googlePlus,
                                linkedinLink: site.linkedinLink,
                                footerCopyRight: '' + site.footerCopyRight,
                                siteName: site.siteName,
                                siteLogo: 'https://clickimize.com/themes-nct/images-nct/9199854241579258395.PNG', //`http://localhost:8080/logo/${site.siteLogo}`,
                                faviconIcon: `http://clickimize.us-east-1.elasticbeanstalk.com/favi/${site.faviconIcon}`,
                                subject: response.subject,
                                siteurl: "https://www.clickimize.com/",
                                email: news.email
                            };
                            let template = ejs.compile(response.template, m);
                          ///  console.log(template(m));
                            let subject = response.subject + "" + site.siteName;

                            var msg = EmailBuilder.getNewsLattersMessage(template(m), subject);
                            msg.to = req.body.email;
                            var ser = new EmailService();
                            ser.sendEmail(msg, function (err, result) {
                                res.send("email send successfully")
                              // console.log("email send success")
                            })
                        })
                    })

                    res.send({
                        status: 1,
                        message: " create news latter successfully"
                    })
                })
                    .catch(err => {
                        res.send({
                            err: err,
                            status: 5,
                            message: "unable to proceess"
                        });
                    });
            })
        }
    })
})
//update Manage News Latter id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    ManageNewsLetter.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "Manage News Latter was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update Manage News Latter with id=${id}. Maybe Manage News Latter was not found or req.body is empty!`
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
//get all  Manage News Latter
router.get('/getall', (req, res) => {
    ManageNewsLetter.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(news => {
        if (news.length != 0) {
            res.json({
                status: 1,
                news: news
            })
        } else {
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
router.get('/getByEmail/:email', (req, res) => {
    const email = req.params.email;
    ManageNewsLetter.findOne({
        where: {
            email: email
        }
    }).then(news => {
        if (news.length != 0) {
            res.json({
                status: 1,
                news: news
            })
        } else {
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
    ManageNewsLetter.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Manage News Latter was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot Manage News Latter  with id=${id}. Maybe Manage News Latter was not found!`
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