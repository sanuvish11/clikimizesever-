const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
const { privatemessage } = require('../models');

var PrivateMessage = db.privatemessage;
const Op = db.Sequelize.Op;
//POST ROUTE
// create send private email
router.post('/save', (req, res) => {
   // console.log(req.body)
    PrivateMessage.create({
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    }).then(data => {
        var m = {
            email: data.email,
            subject: data.subject,
            message: data.message,
        };
        var msg = EmailBuilder.getPrivateMessage(m);
        msg.to = data.email;
        var ser = new EmailService()
        ser.sendEmail(msg, function (err, result) {
            if (err) {
                var r = new Response(err, result);
                response.json(r);
            } else {
                var r = new Response(err, "Password has been sent to your registered email id");
                response.json(r);
            }
        });
        res.send({
            status: 1,
            message: "Email Send Successfully"
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
    PrivateMessage.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "private message was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update private message with id=${id}. Maybe  private message was not found or req.body is empty!`
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
//get all private message
router.get('/getall', (req, res) => {
    PrivateMessage.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                privatemsg: data
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

//View Record By id
router.get('/getById/:id', (req, res) => {
    const id = req.params.id;
    PrivateMessage.findOne({
        where: {
            id: id
        }
    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                privatemsg: data
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
    PrivateMessage.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "private message was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot private message with id=${id}. Maybe private message was not found!`
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