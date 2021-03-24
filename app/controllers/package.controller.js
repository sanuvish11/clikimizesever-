const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");


var Package = db.package;
const Op = db.Sequelize.Op;
//POST ROUTE
//package add on admin 
router.post('/save', (req, res) => {
  Package.findOne({
    where: {
      packageName: req.body.packageName
    }
  }).then(pcakage => {
    if (pcakage) {
      res.send({
        status: 2,
        message: "Package Name Already Exits"
      });
      return;
    }
    else {
      Package.create({
        packageName: req.body.packageName,
        status: req.body.status,
        tblPackageTypeId: req.body.tblPackageTypeId,
      }).then(packages => {
        res.send({
          status: 1,
          message: "package save successfully"
        })
      })
        .catch(err => {
          res.send({
            status: 5,
            err: err,
            message: "unable to process"
          });
        });
    }
  })
})


//update package detail by id(1)
router.post('/update/:id', (req, res) => {
  const id = req.params.id;
/// console.log(req.body)
  Package.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "package update successfully"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot update package with id=${id}. Maybe package was not found or req.body is empty!`
        });
      }
    }).catch(err => {
      //console.log(err)
      res.send({
        status: 5,
        err: err,
        message: "Unable to proccess"
      });
    });
})

//get route
//get all package
router.get('/getall', (req, res) => {
  Package.findAll({
    order: [
      ["id", "DESC"]
  ]
  })
    .then(package => {
      if (package.length != 0)
        res.json({
          status: 1,
          package: package
        })
      else
        res.json({
          status: 4,
          message: "No Record Found"
        })
    }).catch(err => {
      res.json({
        err: err,
        status: 5,
        message: "Unable to proccess"
      });
    });
})
//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  Package.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "Package was deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete Package with id=${id}. Maybe Package was not found!`
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