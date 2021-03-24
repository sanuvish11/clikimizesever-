const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");

var ManageContent = db.managecontent;
const Op = db.Sequelize.Op;
//POST ROUTE
// manage contect on admin 
router.post('/save', (req, res) => {
    ManageContent.create({
            pageTitle: req.body.pageTitle,
            pageSlug: req.body.pageSlug,
            metaKeyword: req.body.metaKeyword,
            metaDescription: req.body.metaDescription,
            linkType: req.body.linkType,
            pageDescription: req.body.pageDescription,
            status: req.body.status,
            url: req.body.url
        }).then(manage => {
            res.send({
                status: 1,
                message: "contant save successfully"
            })
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to process"
            });
        });
});

//update Manage Content detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    ManageContent.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: " Content was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update  Content with id=${id}. Maybe  Content was not found or req.body is empty!`
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
//get route
//get routes manage content
router.get('/getall', (req, res) => {
        ManageContent.findAll({
            order: [
                ["id", "DESC"]
            ]
        }).then(manage => {
            if (manage.length != 0) {
                res.json({
                    status: 1,
                    manage: manage
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
    ManageContent.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Manage Content was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot Manage Content  with id=${id}. Maybe Manage Content  was not found!`
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