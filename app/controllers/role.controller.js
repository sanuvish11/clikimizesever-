const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");
var Role = db.role;
const Op = db.Sequelize.Op;

//POST ROUTE
//admin/user role save  
router.post('/save', (req, res) => {
    Role.findOne({
        where: {
            name: req.body.name
        }
    }).then(role => {
        if (role) {
            res.send({
                status: 2,
                message: "Role Name is already Exits!"
            });
            return;
        }
        else {
            Role.create({
                name: req.body.name,
            }).then(role => {
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
    const id = req.body.id;
    Role.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Role updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
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
//get all role
router.get('/getall', (req, res) => {
    Role.findAll({
    }).then(role => {
        if (role.length != 0) {
            res.json(role)
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
    Role.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            status: 1,
            message: "Role was deleted successfully!"
          });
        } else {
          res.send({
            status: 0,
            message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
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