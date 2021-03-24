const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");

var Like = db.like;
var AddToFavorite = db.addtofavorite;

const Op = db.Sequelize.Op;
//POST ROUTE
// create add to favorites
router.post('/save', (req, res) => {
    AddToFavorite.findOne({
        where: {
            tblUserId: req.body.tblUserId,
            templateId: req.body.templateId,
        }
    }).then(data => {
        if (data) {
            res.send({
                status: 2,
                message: "already Exits!"
            });
            return;
        }
        AddToFavorite.create({
            tblUserId: req.body.tblUserId,
            templateId: req.body.templateId,
            status: req.body.status,
        }).then(data => {
            if (data.length != 0) {
                res.json({
                    status: 1,
                    message: "You have Successfully add to favorite"
                })
            }

        }).catch(err => {
            res.json({
                err: err,
                status: 5,
                message: "Unable to proccess"
            });
        });
    })
});
//get all favirates list
router.get('/getall', (req, res) => {
    AddToFavorite.findAll({
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
                    message: "add to favorite  was Remove successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot add to favorite  with id=${id}. Maybe add to favorite was not found!`
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


//update post status 
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    Like.update(req.body, {
        where: {
            id: id,
        }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "add to favorite was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update add to favorite with id=${id}. Maybe add to favorite was not found or req.body is empty!`
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
//get favirates by  user id
router.get('/getUserFavoriteById/:id', (req, res) => {
    let list = [];
    let results = [];
    const id = req.params.id;
    AddToFavorite.findAll({
        where: {
            tblUserId: id
        },
        order: [
            ["id", "DESC"]
        ]
    }).then(data => {
        if (data.length != 0) {
            list = data;
            list.forEach(element => {
                if (element.length != 0) {
                    let favirates = {
                        tblUserId: element.tblUserId,
                        templateId: element.templateId,
                        status: element.status
                    }
                    results.push(favirates);
                    if (list.length == results.length) {
                        res.send(Array.prototype.concat.apply([], results))
                    }
                }
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