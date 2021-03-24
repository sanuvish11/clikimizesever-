const express = require('express');
const ejs = require('ejs');
const router = express.Router();
var db = require("../models");
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');

var ContactUs = db.contactus;
var EmailTemplate = db.emailtemplate;
var SiteSetting = db.sitesetting;
var Notification = db.notification;
const Op = db.Sequelize.Op;
//POST ROUTE
// create Contact Us

router.post('/save', (req, res) => {
    ContactUs.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        message: req.body.message,
        mobileNumber: req.body.mobileNumber,
        replyMessage: req.body.replyMessage
    }).then(contact => {
        var myJSON = {
            id: contact.id,
            message: contact.message
        }
        const myObjStr = JSON.stringify(myJSON);
      //  console.log(myObjStr);
        Notification.create({
            title: "Contact us",
            content: myObjStr,
            type: "conatct",
            status: 1
        }).then(data => {
           // console.log(data)

            if (data.length != 0) {
                res.json({
                    status: 1,
                    data: data
                })
            } else {
                res.send({
                    status: 4,
                    message: "Email Not Found"
                });
            }
        })
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "Unable To proccess"
        })

    })
})
//update Contact Us  detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    ContactUs.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            EmailTemplate.findOne({
                where: {
                    id: 3
                }
            }).then(response => {
                SiteSetting.findOne({}).then(site => {
                    var m = {
                        footerCopyRight: '' + site.footerCopyRight,
                        siteName: site.siteName,
                        siteLogo: 'https://clickimize.com/themes-nct/images-nct/9199854241579258395.PNG', //`http://localhost:8080/logo/${site.siteLogo}`,
                        subject: response.subject,
                        siteurl: "https://www.clickimize.com/",
                        email: req.body.email,
                        message: req.body.message,
                        firstName: req.body.firstName,
                        replyMessage: req.body.replyMessage
                    }
                    let template = ejs.compile(response.template, m);
                   // console.log(template(m));
                    subject = response.subject + " " + site.siteName;
                    var msg = EmailBuilder.getContactMessage(template(m), subject);
                    msg.to = req.body.email;
                    var ser = new EmailService()
                    ser.sendEmail(msg, function (err, result) { })
                })
            })
            res.json({
                status: 1,
                message: "Contact Us was updated successfully."
            });

        } else {
            res.send({
                status: 0,
                message: `Cannot update Contact Us with id=${id}. Maybe  Contact Us was not found or req.body is empty!`
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
//get all  contact us
router.get('/getall', (req, res) => {
    ContactUs.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(contact => {
        if (contact.length != 0) {
            res.json({
                status: 1,

                contact: contact
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
    ContactUs.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Contact Us was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot Contact Us  with id=${id}. Maybe Contact Us  was not found!`
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
//get all  contact us by email
router.get('/getConatctById/:id', (req, res) => {
    const id = req.params.id;
    ContactUs.findOne({
        where: {
            id: id
        }
    }).then(contact => {
        if (contact.length != 0) {
            res.json({
                status: 1,

                contact: contact
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
module.exports = router;