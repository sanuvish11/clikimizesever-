const express = require('express');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
const router = express.Router();
var db = require("../models");
const multer = require('multer');
const { pathToFileURL } = require('url');
const { extname } = require('path');
const path = require("path");
const fs = require("fs");
const authJwt = require("../middleware/authJwt");
var Role = db.role;
var Admin = db.admin;
const Op = db.Sequelize.Op;
//POST ROUTE
//user registration on admin 
var storage = multer.diskStorage({
    destination: "./public/profile/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + extname(file.originalname));
    }
});
var profile = multer({ storage: storage }).single('profile');
//post routes
//admin registration
router.post('/signup', (req, res) => {
    Admin.findOne({
        where: {
            adminName: req.body.adminName
        }
    }).then(user => {
        if (user) {
            res.send({
                status: 2,
                message: "User Name Already Exits"
            });
            return;
        } else {
            Admin.create({
                    adminName: req.body.adminName,
                    adminEmail: req.body.adminEmail,
                    ipAddress: req.body.ipAddress,
                    adminPass: bcrypt.hashSync(req.body.adminPass, 8),
                    profileImg: req.body.profileImg,
                    adminType: req.body.adminType,
                    permissions: req.body.permissions,
                    isActive: req.body.isActive,
                    created_date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    updated_date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                }).then(user => {
                    if (req.body.roles) {
                        Role.findAll({
                            where: {
                                name: {
                                    [Op.or]: req.body.roles
                                }
                            }
                        }).then(roles => {
                            res.send(roles)
                            user.setRoles(roles).then(() => {
                                res.send({
                                    status: 1,
                                    message: "admin registration successfully"
                                });
                            });
                        });
                    } else {
                        user.setRoles([1]).then(() => {
                            var m = {
                                adminEmail: user.adminEmail,
                                adminPass: user.adminPass,
                                adminName: user.adminName,
                            };
                           // var msg = EmailBuilder.getSignUpMessage(m);
                            msg.to = req.body.email;
                            var ser = new EmailService()
                            ser.sendEmail(msg, function(err, result) {
                                if (err) {
                                res.send(err);
                                }
                            });
                            res.send({
                                status: 1,
                                message: "admin registration successfully"
                            });
                        });
                    }
                })
                .catch(err => {
                    res.send({
                        err: err,
                        status: 5,
                        message: "unable to proceess"
                    });
                });
        }
    })
})


//admin dashborad login
router.post('/login', (req, res) => {
    Admin.findOne({
            where: {
                adminName: req.body.adminName
            }
        })
        .then(user => {
            if (!user) {
                return res.send({
                    status: 3,
                    message: "UserName Not Found"
                });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.adminPass,
                user.adminPass
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 3,
                    message: "Invalid Password"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 36500 });
            var tokensite = token.replace(".", "124abcdkamal");
            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    status: 1,
                    user: {
                        id: user.id,
                        adminName: user.adminName,
                        adminEmail: user.adminEmail,
                        ipAddress: user.ipAddress,
                        adminType: user.adminType,
                        permissions: user.permissions,
                        isActive: user.isActive,
                        roles: authorities,
                        accessToken: tokensite
                    }
                });
            });
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proceess"
            });
        });
})


//forget password admin by email
router.post('/forgetpassword', (req, res) => {
    Admin.findOne({
            where: {
                adminEmail: {
                    [Op.like]: req.body.adminEmail
                }
            }
        })
        .then(data => {
            if (data.length == 0) {
                res.send({
                    status: 4,
                    message: "Email Id Not Found"
                });
            } else {
                res.json(data)
                var m = {
                    adminEmail: data.adminEmail,
                    adminPass: data.adminPass,
                    adminName: data.adminName,
                };
                var msg = EmailBuilder.getForgetPasswordMessage(m);
                msg.to = req.body.adminEmail;
                var ser = new EmailService()
                ser.sendEmail(msg, function(err, result) {})
            }
        }).catch(err =>
            res.send({
                err: err,
                status: 5,
                message: "please check internet connection"
            }))
})

//update password by id
router.post('/changepassword/:id', (req, res) => {
    const id = req.params.id
    Admin.findOne({
        where: {
            id: id
        }
    }).then(admin => {
        var passwordIsValid = bcrypt.compareSync(
            req.body.currentPassword,
            admin.adminPass
        );
        if (!passwordIsValid) {
            return res.send({
                status: 3,
                message: "Invalid Password"
            });
        }
        Admin.update({ adminPass: bcrypt.hashSync(req.body.adminPass, 8) }, {
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "password updated successfully."

                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update password with id=${id}. Maybe  password was not found or req.body is empty!`
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


//update admin detail by id(1)
router.post('/update/:id', (req, res) => {
        const id = req.body.id;
        User.update(req.body, {
                where: { id: id }
            })
            .then(num => {
                if (num == 1) {
                    res.send({
                        status: 1,
                        message: "updated successfully."

                    });
                } else {
                    res.send({
                        status: 0,
                        message: `Cannot update admin info with id=${id}. Maybe  admin info was not found or req.body is empty!`
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
    //update profile image
router.post('/updateImage', profile, (req, res) => {
    const id = req.body.id;
    //console.log(req.file)
    Admin.update({ profileImg: req.file.filename }, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "profile image update successfully"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update profile image with id=${id}. Maybe profile image was not found or req.body is empty!`
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

//get route
//get all record
router.get('/getall', (req, res) => {
    Admin.findAll({
        order: [
            ["id", "DESC"]
        ]
    })
        .then(admin => {
            if (admin.length != 0) {
                res.json(admin, {
                    status: 1
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
                message: "unble to process"
            });
        });
})


module.exports = router;