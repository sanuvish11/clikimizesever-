const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");

var EmailTemplate = db.emailtemplate;
const Op = db.Sequelize.Op;
//POST ROUTE
// manage email template by admin 
router.post('/save', (req, res) => {
    EmailTemplate.findOne({
        where: {
            subject: req.body.subject
        }
    }).then(emailtem => {
        if (emailtem) {
            res.send({
                status: 2,
                message: "template name is already exits!"
            });
            return;
        }
        EmailTemplate.create({
                subject: req.body.subject,
                description: req.body.description,
                template: req.body.template,
                emailStatus: req.body.emailStatus
            }).then(emailtem => {
                res.send({
                    status: 1,
                    message: "email template save successfully"
                })
            })
            .catch(err => {
                res.send({
                    err: err,
                    status: 5,
                    message: "unable to proccess"
                });
            });
    })
});

//update Manage Content detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    EmailTemplate.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "email template was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update email template with id=${id}. Maybe email template was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "unable to proccess=" + id
        });
    });
});
//get routes email template
router.get('/getall', (req, res) => {
        EmailTemplate.findAll({
            order: [
                ["id", "DESC"]
            ]
        }).then(email => {
            if (email.length != 0) {
                res.json({
                    status: 1,
                    email: email
                })
            } else {
                res.json({
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
    //get By id
    //get routes email template
router.get('/getById/:id', (req, res) => {
    const id = req.params.id;
    EmailTemplate.findOne({
        where: {
            id: id
        }
    }).then(email => {
        if (email.length != 0) {
            res.json({
                status: 1,
                email: email
            })
        } else {
            res.json({
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
    EmailTemplate.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "email template was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot delete email template with id=${id}. Maybe email template was not found!`
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