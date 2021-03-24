const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");

var ManageAbuseKeyword = db.manageabusekeyword;
const Op = db.Sequelize.Op;
//POST ROUTE
// create abuse keyword
router.post('/save', (req, res) => {
    ManageAbuseKeyword.findOne({
        where: {
            abuseKeyword: req.body.abuseKeyword
        }
    }).then(emailtem => {
        if (emailtem) {
            res.send({
                status: 2,
                message: "Abuse keyword is already Exits!"
            });
            return;
        }
        ManageAbuseKeyword.create({
            tblAdminId: req.body.tblAdminId,
            abuseKeyword: req.body.abuseKeyword,
            status: req.body.status,
        }).then(keyword => {
            res.send({
                status: 1,
                message: "Abuse keyword create successfully"
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
});

//update abuse keyword  detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    ManageAbuseKeyword.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
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
router.get('/getall', (req, res) => {
    ManageAbuseKeyword.findAll({
    }).then(abuse => {
        if (abuse.length != 0) {
            res.json({
                status: 1,
                abuse: abuse
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
            err:err,
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
module.exports = router;