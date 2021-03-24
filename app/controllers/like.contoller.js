const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");

var Like = db.like;
var Notification = db.notification;
var ManageBlog = db.manageblog;
const Op = db.Sequelize.Op;
//POST ROUTE
// create like 
router.post('/save', (req, res) => {
    Like.findOne({
        where: {
            tblUserId: req.body.tblUserId,
            tblBlogId: req.body.tblBlogId,
        }
    }).then(data => {
        if (data) {
            res.send({
                status: 2,
                message: "Like already Exits!"
            });
            return;
        }
        Like.create({
            tblUserId: req.body.tblUserId,
            tblBlogId: req.body.tblBlogId,
            status: req.body.status,
        }).then(data => {
            ManageBlog.findOne({
                where: {
                    id: data.tblBlogId
                }
            }).then(blogres => {
                var myJSON = {
                    id: blogres.id,
                    message: blogres.blogTitle
                }
                const myObjStr = JSON.stringify(myJSON);
                ///.log(myObjStr);
                Notification.create({
                    title: "Blog Like ",
                    content: myObjStr,
                    type: "blog",
                    status: 1
                }).then(data => {
                    res.send({
                        status: 1,
                        message: "You have Successfully like this page"
                    })
                })
            })


        })
            .catch(err => {
                res.send(err);
            });
    })
});

router.get('/getall', (req, res) => {
    Like.findAll({
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
    const id = req.body.id;
    Like.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "like  was Remove successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot like  with id=${id}. Maybe like was not found!`
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


//update post status disklike 
router.post('/update/:userid/:blogid', (req, res) => {
    const userid = req.params.userid;
    const blogid = req.params.blogid;
    Like.update(req.body, {
        where: {
            tblUserId: userid,
            tblBlogId: blogid
        }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "like was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update like with id=${id}. Maybe like was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        // console.log(err)
        res.send({
            err: err,
            status: 5,
            message: "unable to proceess"
        });
    });
});
//get all user like
router.get('/getUserLikeBlogByid/:id', (req, res) => {
    const id = req.params.id;
    let list = [];
    let results = [];
    Like.findAll({
        where: {
            tblUserId: id,
            status: 1
        },
    }).then(data => {
        list = data;
        list.forEach(element => {
            if (element.length != 0) {
                // let userlikedata = {
                //     tblBlogId: element.tblBlogId
                // }
                results.push(element.tblBlogId);
                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }

            } else {
                res.send({
                    status: 4,
                    message: "No Record Found"
                })
            }
        })
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: "unable to proccess"
        });
    });
})

module.exports = router;