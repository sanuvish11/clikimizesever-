const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const router = express.Router();
var db = require("../models");
const { packageType } = require('../models');

var UserPackage = db.userpackage;
var PackageDetail = db.packagedetail;
var PackageType = db.packageType;
var Notification = db.notification;
var Website = db.website;
var User = db.user;
const Op = db.Sequelize.Op;
//POST ROUTE
//user registration on admin 
router.post('/save', (req, res) => {
  UserPackage.findOne({
    where: {
      tblUserId: req.body.tblUserId,
      tblPackageDetailId: req.body.tblPackageDetailId
    }
  }).then(userPackage => {
    if (userPackage) {
      res.send({
        status: 2,
        message: "Failed! Package already exits!"
      });
    }
    else {
      PackageDetail.findOne({
        where: {
          id: req.body.tblPackageDetailId
        }
      }).then(data => {
        var d = new Date();
        let nMonths = data.packageDuration / 30;
        let month = Math.ceil(nMonths);
        UserPackage.create({
          tblUserId: req.body.tblUserId,
          tblPackageDetailId: req.body.tblPackageDetailId,
          packageName: req.body.packageName,
          status:0,
          startDate: Date.now(),
          endDate: d.setMonth(month + 1),
        }).then(userpakage => {
          var myJSON = {
            id: userpakage.tblUserId,
            message: userpakage.packageName
          }
          const myObjStr = JSON.stringify(myJSON);
          console.log(myObjStr);
          Notification.create({
            title: "purchase new package",
            content: myObjStr,
            type: "package",
            status: 1
          }).then(data => {
            if (data != 0) {
              res.send({
                status: 1,
                message: "Record Insert successfully",
              });
            }
          }).catch(err => {
            res.send({
              err: err,
              status: 5,
              message: "unable to proccess"
            });
          });
        })

      })
    }
  })
})


//update package detail by id(1)
router.post('/update/:id', (req, res) => {
  const id = req.params.id;
  UserPackage.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "User Package was updated successfully."
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot update User Package with id=${id}. Maybe User Package was not found or req.body is empty!`
        });
      }
    }).catch(err => {
      res.send({
        err: err,
        status: 5,
        message: "unable to proccess=" + id
      });
    });
})

//get route
//get all record form userpackage with join packagedetai and user detail
router.get('/getall', (req, res) => {
  UserPackage.findAll({
    where: {
      tblUserId: req.body.tblUserId
    },
    include: [{
      model: PackageDetail,
      required: true,
    },
    {
      model: User,
      required: true
    }], order: [
      ["id", "DESC"]
    ]
  })
    .then(userpackage => {
      if (userpackage.length != 0) {
        res.send({
          status: 1,
          userpackage: userpackage
        })
      }
      else {
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
//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  UserPackage.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status: 1,
          message: "User Package was deleted successfully!"
        });
      } else {
        res.send({
          status: 0,
          message: `Cannot delete User Package with id=${id}. Maybe User Package was not found!`
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
//get singal purchase plan
router.get('/getUserPlanByUserId/:id', (req, res) => {
  const id = req.params.id;
  UserPackage.findOne({
    where: {
      tblUserId: id
    }
  }).then(userpack => {
    PackageDetail.findOne({
      where: {
        id: {
          [Op.like]: userpack.tblPackageDetailId
        }
      }
    }).then(pkgDetail => {
      PackageType.findOne({
        where: {
          id: pkgDetail.tblPackageTypeId
        }
      }).then(packtype => {
        Website.findAndCountAll({
          where: {
            userID: id
          }
        }).then(data => {
          console.log(data.count);
          let userpackage = {
            id: userpack.id,
            websiteCount: data.count,
            startDate: userpack.startDate,
            endDate: userpack.endDate,
            packageType: packtype.name,
            packageName: pkgDetail.packageName,
            numberofSite: pkgDetail.numberofSite,
            packageDuration: pkgDetail.packageDuration,
            packagePrice: pkgDetail.packagePrice,
            packageStatus: pkgDetail.packageStatus
          }
          if (packtype.length != 0) {
            res.json({
              status: 1,
              userpackage: userpackage,
              message: 'Successfully get Record'
            })
          }
          else {
            res.json({
              status: 4,
              message: 'Not Found'
            })
          }
        })



      })
    })
  }).catch(err => {
    res.send({
      err: err,
      status: 5,
      message: 'unbale to proccess'
    })
  })
})




module.exports = router;