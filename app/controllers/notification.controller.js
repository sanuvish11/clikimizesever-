const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
const { privatemessage, notification } = require('../models');


var Notification = db.notification;
const Op = db.Sequelize.Op;
//POST ROUTE
// create notification 
router.post('/save', (req, res) => {
    Notification.create({
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        status: req.body.status
    }).then(data => {
        res.send({
            status: 1,
            message: "Notification Send Successfully"
        })
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "unable to proceess"
        });
    });
})

//update Notification  by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    Notification.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "Notification message was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update Notification message with id=${id}. Maybe  Notification message was not found or req.body is empty!`
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
//get all Notification
router.get('/getllByStatus', (req, res) => {
    Notification.findAll({
        where: {
            status: 1
        },
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
router.get('/getall', (req, res) => {
       Notification.findAll({
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
            res.json({
                status: 4,
                message: "No Record Found"
            })
        }


    }).catch(err => {
        res.send(err, {
            err: err,
            status: 5,
            message: "unable to proccess"
        });
    });
})
//View Record By id
router.get('/getById/:id', (req, res) => {
    const id = req.params.id;
    Notification.findOne({
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
    Notification.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Notification was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot Notification with id=${id}. Maybe Notification was not found!`
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


/* GET todo listing. */
router.get("/",(async (req, res, next) => {
      const todos = await notification.findAll({});
      return res.json({
        error: false,
        data: todos
      });
    })
  );

  
module.exports = router;