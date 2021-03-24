const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");
const { packageType } = require('../models');

var PackageDetail = db.packagedetail;
var PackageType = db.packageType;

const Op = db.Sequelize.Op;
//POST ROUTE
//save package details
router.post('/save', (req, res) => {
  //  console.log(req.body)
    PackageDetail.findOne({
        where: {
            packageName: req.body.packageName
        }
    }).then(user => {
        if (user) {
            res.send({
                status: 2,
                message: "Package Name is already Exits!"
            });
            return;
        } else {
            PackageDetail.create({
                    packageName: req.body.packageName,
                    packageDetail: req.body.packageDetail,
                    packagePrice: req.body.packagePrice,
                    packageDuration: req.body.packageDuration,
                    packageStatus: req.body.packageStatus,
                    tblPackageTypeId: req.body.tblPackageTypeId,
                    numberofSite: req.body.numberofSite
                }).then(packages => {
                    res.json({
                        status: 1,
                        message: "record save successfully"
                    })
                })
                .catch(err => {
                    res.send({
                        err: err,
                        status: 5
                    });
                });
        }
    })
})



//update package detail by id(1)
router.post('/update/:id', (req, res) => {
        const id = req.params.id;
       // console.log(req.body)
        PackageDetail.update(req.body, {
                where: { id: id }
            })
            .then(num => {
                if (num == 1) {
                    res.send({
                        status: 1,
                        message: "Package Detail was updated successfully."
                    });
                } else {
                    res.send({
                        status: 0,
                        message: `Cannot update package Detail with id=${id}. Maybe package Detail was not found or req.body is empty!`
                    });
                }
            }).catch(err => {
                res.send({
                    err: err,
                    status: 5
                });
            });
    })
    //get bY id 0
router.post('/getIdByPackage', (req, res) => {
        let query = req.body.type;
        PackageDetail.findAll({
                where: {
                    packageStatus: query
                }, order: [
                    ["id", "DESC"]
                ]
            })
            .then(package => {
                if (package != 0) {
                    res.json({
                        status: 1,
                        package: package
                    })
                } else {
                    res.send({
                        status: 4,
                        message: "No Record Found"

                    })
                }
            }).catch(err => {
                res.send(err);
            })
    })
    //get route
    //get all record
router.get('/getall', (req, res) => {
        PackageDetail.findAll({
            
                include: [{
                    model: packageType,
                    required: true,
                }], order: [
                    ["id", "DESC"]
                ]
            })
            .then(package => {
                if (package.length != 0) {
                    res.send({
                        status: 1,
                        package: package
                    })
                } else {
                    res.send({
                        status: 4,
                        message: "Record Not Found"
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
    //detete route
    //delete record by id
router.delete('/delete/:id', (req, res) => {
    const id = req.body.id;
    PackageDetail.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "package Detail was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot package Detail  with id=${id}. Maybe package Detail  was not found!`
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
router.get('/getPackgeById/:id', (req, res) => {
    const id = req.params.id
   // console.log(id);
    PackageDetail.findOne({
            where: {
                id: id
            }
        })
        .then(package => {
            
            if (package != 0) {
                res.json({
                        status: 1,
                        package: package
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
                message: "unable to proccess=" + id
            });
        })
})
module.exports = router;