const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");
var PackageType = db.packageType;
const Op = db.Sequelize.Op;

//POST ROUTE
//add package type
router.post('/save', (req, res) => {
    PackageType.findOne({
        where: {
            name: req.body.name
        }
    }).then(role => {
        if (role) {
            res.send({
                status: 2,
                message: "Package Type  is already Exits!"
            });
            return;
        }
        else {
            PackageType.create({
                name: req.body.name,
                status:req.body.status
            }).then(data => {
                res.send({
                    status: 1,
                    message: "record insert successfully"
                })
            })
                .catch(err => {
                    res.send({
                        err: err,
                        status: 5,
                        message: "unble to proceess"
                    });
                });
        }
    })
})


//update package detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    PackageType.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Package Type updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update Package Type with id=${id}. Maybe Package Type was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unble to proceess"
            });
        });
})

//get route
//get package type
router.get('/getall', (req, res) => {
    PackageType.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(data => {
        if (data.length != 0) {
            res.json({
              status:1,
              data:data  
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
            message: "unble to proceess"
        });
    })
})
//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    PackageType.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            status: 1,
            message: "Package Type was deleted successfully!"
          });
        } else {
          res.send({
            status: 0,
            message: `Cannot delete Package Type with id=${id}. Maybe Package Type was not found!`
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