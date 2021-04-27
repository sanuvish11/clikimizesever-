const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");

var Message = db.message;
var Notification = db.notification;
var UserNotification = db.usernotification;
var MessageHistory = db.messagehistory;
var User = db.user;
const Op = db.Sequelize.Op;
//POST ROUTE
// create message
router.post('/save', (req, res) => {
 //   console.log(req.body)
    Message.findOne({
        where: {
            tblUserId: req.body.tblUserId
        }
    }).then(response => {
        if (response) {
            MessageHistory.create({
                indox_id: 'admin_' + response.tblUserId,
                message: req.body.message,
                to: req.body.to,
                from: req.body.from
            }).then(data => {
                if (data.to == 'admin') {
                    UserNotification.create({
                        title: "Admin send a message",
                        tblUserId: response.tblUserId,
                        content: "message " + data.message + "",
                        type: "message",
                        status: 1
                    }).then(purchase => {
                        res.send({
                            status: 1,
                            message: "message send sucessfully"
                        })
                    })
                }
                else {
                    User.findOne({
                        where: {
                            id: req.body.tblUserId
                        }
                    }).then(userData => {
                        var myJSON = {
                            id: data.tblUserId,
                            message: data.message
                        }
                        const myObjStr = JSON.stringify(myJSON);
                        Notification.create({
                            title: userData.firstName + " " + "has send message to you.",
                            content: myObjStr,
                            type: "Message",
                            status: 1
                        }).then(data => {

                        })
                    })
                }

            })
        }
        else {
            Message.create({
                tblUserId: req.body.tblUserId,
                message: req.body.message,
                reply_message: req.body.reply_message
            }).then(data => {
                if (data.length != 0) {
                    User.findOne({
                        where: {
                            id: data.tblUserId
                        }
                    }).then(userData => {
                        var myJSON = {
                            id: data.tblUserId,
                            message: data.message
                        }
                        const myObjStr = JSON.stringify(myJSON);
                        Notification.create({
                            title: userData.firstName + " " + "has send message to you.",
                            content: myObjStr,
                            type: "Message",
                            status: 1
                        }).then(data => {
                            //create user notification

                        })
                    })
                }

            }).catch(err => {
                res.send({
                    err: err,
                    status: 5,
                    message: "unable to proceess"
                });
            })
        }



    })

});

//update abuse keyword  detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    ManageAbuseKeyword.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            UserNotification.create({
                title: "Purchase new package",
                tblUserId: userpakage.tblUserId,
                content: "Thank you for purchasing " + userpakage.packageName + "",
                type: "package",
                status: 1
            }).then(purchase => {
                res.send({
                    status: 1,
                    message: "notification create successfully"
                })
            })
            res.send({
                status: 1,
                message: "abuse keyword was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update abuse keyword with id=${id}. Maybe  abuse keyword was not found or req.body is empty!`
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
router.get('/getMessage/:id', (req, res) => {
    const id = req.params.id;

    MessageHistory.findAll({
        where: {
            indox_id: {
                [Op.like]: "admin_" + id
            }
        }
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
    ManageAbuseKeyword.destroy({
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
//get all message admin
router.get('/getall', (req, res) => {

    Message.findAll({
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
module.exports = router;