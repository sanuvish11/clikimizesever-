const express = require('express');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
const multer = require('multer');
const { pathToFileURL } = require('url');
const { extname } = require('path');
const path = require("path");
const fs = require("fs");
const router = express.Router();
var db = require("../models");
var Like = db.like;
const Op = db.Sequelize.Op;
let ejs = require('ejs');
const fetch = require('node-fetch');

var User = db.user;
var Role = db.role;
var EmailTemplate = db.emailtemplate;
var ResetPass = db.reset;
var SiteSetting = db.sitesetting;
var UserPackage = db.userpackage;
var PackageDetail = db.packagedetail;
var PackageType = db.packageType;
var Notification = db.notification;
var ManageBlog = db.manageblog;
var Transaction = db.transaction;
var Website = db.website;
var Like = db.like;
var ManageNewsLetter = db.managenewsletter;
var ContactUs = db.contactus;


var storage = multer.diskStorage({
    destination: "./public/profile/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + extname(file.originalname));
    }
});
var profile = multer({ storage: storage }).single('profile');
//post route 
//user registation 
router.post('/register', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.send({
                status: 2,
                message: "Email is already in Exits!"
            });
            return;
        } else {
            User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 6),
                DOB: req.body.DOB,
                roleId: 2,
                status: 0,
                ipAddress: req.body.ipAddress,
                address: req.body.address,
                mobileNumber: req.body.mobileNumber
            }).then(user => {
                var myJSON = {
                    id: user.id,
                    message: "a new user register"
                }
                const myObjStr = JSON.stringify(myJSON);
                Notification.create({
                    title: "new registration",
                    content: myObjStr,
                    type: "user",
                    status: 1
                }).then(data => {

                })
                EmailTemplate.findOne({
                    where: {
                        id: 6
                    }
                }).then(response => {
                    SiteSetting.findOne({
                    }).then(site => {
                        let token = "";
                        var result = '';
                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for (var i = 0; i < 12; i++) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        token = result;
                        //<--- --->
                        ResetPass.create({
                            email: user.email,
                            token: token,
                            status: 0,
                        }).then(verifyToken => {
                            // console.log(ejs.compile(response.template));
                            var m = {
                                footerCopyRight: '' + site.footerCopyRight,
                                verificationLink: "http://clickimizeuser.s3-website.us-east-2.amazonaws.com/accVerification/" + verifyToken.token,
                                siteName: site.siteName,
                                siteLogo: 'http://' + req.headers.host + '/logo/' + site.siteLogo,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email
                            };
                            let template = ejs.compile(response.template, m);
                            let subject = response.subject + " " + site.siteName;
                            var msg = EmailBuilder.getUserRegisterUpMessage(template(m), subject);
                            msg.to = req.body.email;
                            var ser = new EmailService()
                            ser.sendEmail(msg, function (err, result) {
                                res.send("email send successfully");
                                //console.log("email send success")
                            })
                        })
                    })
                })

                res.send({
                    status: 1,
                    message: "User Registration successfully"
                })
            }).catch(err => {
                res.send({
                    err: err,
                    status: 5,
                    message: "unable to proccess"
                });
            });
        }
    })
})

//user  login
router.post('/login', (req, res) => {
  //  console.log(req.body)
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        let type = req.body.userType;
        if (!user) {
            return res.send({
                status: 4,
                message: "User Not found."
            });
        }
        if (type == 1) {
            if (user.status != req.body.status) {
                return res.send({
                    status: 6,
                    message: "Please email verify link!"
                });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password,
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 3,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                //  algorithm: 'RS256',
                expiresIn: 10 * 60 * 1000,
                // 24 hours
            });
            var tokensite = token.replace(".", "124abcdkamal");
            var roles;
            Role.findOne({
                where: {
                    id: {
                        [Op.like]: user.roleId
                    }
                }
            }).then(role => {
                roles = role.name;

                res.send({
                    status: 1,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        profileImg: 'http://' + req.headers.host + '/profile/' + user.profileImg,
                        roleName: roles,
                        accessToken: tokensite,
                        phone: user.mobileNumber,
                        address: user.address,
                        userType: user.userType
                    }
                });
            })
        }
        else if (type == 2) {
            var token = jwt.sign({ id: user.id }, config.secret, {
                //  algorithm: 'RS256',
                expiresIn: 10 * 60 * 1000,
                // 24 hours
            });
            var tokensite = token.replace(".", "124abcdkamal");
            var roles;
            Role.findOne({
                where: {
                    id: {
                        [Op.like]: user.roleId
                    }
                }
            }).then(role => {
                roles = role.name;

                res.send({
                    status: 1,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        profileImg: 'http://' + req.headers.host + '/profile/' + user.profileImg,
                        roleName: roles,
                        accessToken: tokensite,
                        phone: user.mobileNumber,
                        address: user.address,
                        userType: user.userType
                    }
                });
            })

        }
    }).catch(err => {
      //  console.log(err)
        res.send({
            err: err,
            status: 5,
            message: "unable to login"
        });
    });
})


//generate forget passord link by email
router.post('/forgetpassword', (req, res) => {
    User.findOne({
        where: {
            email: {
                [Op.like]: req.body.email
            }
        }
    })
        .then(data => {
            if (data.length != 0) {
                EmailTemplate.findOne({
                    where: {
                        id: 5
                    }
                }).then(response => {
                    SiteSetting.findOne({}).then(site => {
                        let token = "";
                        var result = '';
                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for (var i = 0; i < 12; i++) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        token = result;
                        ResetPass.create({
                            email: data.email,
                            token: token,
                            status: 0,
                        }).then(resetpass => {
                            var m = {
                                twitterLink: site.twitterLink,
                                googlePlus: site.googlePlus,
                                linkedinLink: site.linkedinLink,
                                footerCopyRight: '' + site.footerCopyRight,
                                resetLink: "http://clickimizeuser.s3-website.us-east-2.amazonaws.com/reset/" + token,
                                siteName: site.siteName,
                                profileImg: 'http://' + req.headers.host + '/profile/' + data.profileImg,
                                siteLogo: 'http://' + req.headers.host + '/logo/' + site.siteLogo,
                                faviconIcon: 'http://' + req.headers.host + '/favi/' + site.faviconIcon,
                                subject: response.subject,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                            };
                            let template = ejs.compile(response.template, m);
                            let subject = response.subject + " " + site.siteName;
                            var msg = EmailBuilder.getForgetPasswordMessage(template(m), subject);
                            msg.to = req.body.email;
                            var ser = new EmailService()

                            ser.sendEmail(msg, function (err, result) {
                                res.send('email send successfully')

                            })
                            res.send({
                                status: 1,
                                message: "Mail Sent"
                            });
                        });
                    })
                })
            } else {
                res.send({
                    status: 4,
                    message: "Email Not Found"
                });

            }
        }).catch(err => res.send(err))
});
//update password
router.post('/updatepassword/:id', (req, res) => {
    const id = req.params.id;
    User.findOne({
        where: {
            id: id
        }
    }).then(user => {
        var passwordIsValid = bcrypt.compareSync(
            req.body.currentpassword,
            user.password
        );
        if (!passwordIsValid) {
            return res.send({
                status: 3,
                message: "Invalid Password!"
            });
        }
        User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Password was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update User with id=${id}. Maybe User was not found is empty!`
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
})

//update logo
router.post('/updateprofile/:id', profile, (req, res) => {
    const id = req.params.id;
    //console.log(id);

    User.update({ profileImg: req.file.filename }, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "user profile  updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update  with id=${id}. Maybe  was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
});
//update any fild 
router.post('/update/:email', (req, res) => {
    const email = req.params.email;
    User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { email: email }
    }).then(num => {
        if (num == 1) {
            ResetPass.update({
                status:1
            }).then(data => {
                res.send({
                    status: 1,
                    message: "User was updated successfully."
                });
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update User with id=${id}. Maybe  abuse User found or req.body is empty!`
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
//update user details by id
router.post('/updateById/:id', (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "User was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update User with id=${id}. Maybe  abuse User found or req.body is empty!`
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

//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "User was deleted successfully!"
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
//get route
//get all  user
router.get('/getall', (req, res) => {
    let results = [];
    let list = [];
    User.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(user => {
        if (user.length != 0) {
            //  console.log(user)

            list = user;
            list.forEach((element) => {
                //console.log(element)
                let userlist = {
                    id: element.id,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    email: element.email,
                    profileImg: 'http://' + req.headers.host + '/profile/' + element.profileImg,
                    status: element.status,
                    mobileNumber: element.mobileNumber,
                    address: element.address,
                    createdAt: element.createdAt
                }
                //   console.log(userpackage);
                results.push(userlist);

                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }

            })
        }
        else {
            res.send({
                status: 4,
                message: 'No Record Found!'
            })
        }

    }).catch(err => {
        res.send(err);
    });
});

router.get('/checkLink/:ref', (req, res) => {

    const token = req.params.ref;
    console.log(token)
    ResetPass.findOne({
        where: {
            token: token,
            status: 0
        }
    }).then(response => {
        console.log(response)
        if (response.length != 0) {
            res.json({
                status: 1,
                response: response
            })
        } else {
            res.send({
                status: 4,
                message: "Invalid token"
            })
        }
    }).catch(err => {
        res.send({
            err: err,
            status: 5,
            message: 'Invalid Link, Please regenerate another reset password link.'
        })
    });
})
//get plan by user id
router.get('/getplanByUserId/:id', (req, res) => {
    const id = req.params.id;
    let results = [];
    let list = [];
    UserPackage.findAll({
        where: {
            tblUserId: id
        },
        order: [
            ["id", "DESC"]
        ]
    }).then(userpack => {
        list = userpack;
        list.forEach(ele => {
            Website.findAndCountAll({
                where: {
                    userId: id,
                    packageDetailId: ele.tblPackageDetailId
                }
            }).then(web => {



                // console.log(userpack);

                list.forEach((element) => {
                    PackageDetail.findAll({
                        where: {
                            id: {
                                [Op.like]: element.tblPackageDetailId
                            }
                        }
                    }).then(pkgDetail => {
                        list1 = pkgDetail;

                        list1.forEach((element1) => {
                            PackageType.findAll({
                                where: {
                                    id: element1.tblPackageTypeId
                                }
                            }).then(packtype => {
                                list2 = packtype
                                list2.forEach((element2) => {
                                    const currentDate = new Date();
                                    //  console.log(currentDate)
                                    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*millisecond
                                    const diffDays = Math.ceil((element.endDate - currentDate) / oneDay);
                                    let userpackage = {
                                        daycount: diffDays,
                                        websiteCount: web.count,
                                        id: element1.id,
                                        startDate: element.startDate,
                                        endDate: element.endDate,
                                        packageType: element2.name,
                                        packageName: element1.packageName,
                                        numberofSite: element1.numberofSite,
                                        packageDuration: element1.packageDuration,
                                        packagePrice: element1.packagePrice,
                                        packageStatus: element1.packageStatus
                                    }
                                    results.push(userpackage);

                                    if (list.length == results.length) {
                                        res.send(Array.prototype.concat.apply([], results))
                                    }

                                })
                            })
                        })
                    })
                })
            })
        })
    }).catch(err => {
        //console.log(err)
        res.send({
            err: err,
            status: 5,
            message: 'unbale to proccess'
        })
    })
})

//get Record By Email id
router.get('/getById/:id', (req, res) => {
    const id = req.params.id;
    User.findOne({
        where: {
            id: id
        }
    }).then(user => {
        if (user.length != 0) {
            res.json({
                status: 1,
                user: user
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
});
//count all user
router.get('/getCount', (req, res) => {
    let results = [];
    let list = [];
    User.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(user => {
        list = user;
        list.forEach((element) => {
            User.findAndCountAll({
                where: {
                    id: {
                        [Op.like]: element.id
                    }
                }
            }).then(data => {
                let userdata = {
                    count: data.count
                }
                results.push(userdata);
                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }
            })
        })
    })
})
router.get('/getallcount', (req, res) => {
    User.findAndCountAll({
    })
        .then(result => {
            var date = (new Date()).toISOString().split('T')[0];
            User.findAndCountAll({
                where: {
                    createdAt: date
                }
            }).then(todaycount => {
                ManageBlog.findAndCountAll({
                }).then(BlogCount => {
                    Like.findAndCountAll({

                    }).then(likeCount => {
                        Transaction.findAndCountAll({

                        }).then(transactionCount => {
                            var date = (new Date()).toISOString().split('T')[0];
                            Transaction.findAndCountAll({
                                where: {
                                    paymenDate: date
                                }
                            }).then(todaytransactionCount => {
                                PackageDetail.findAndCountAll({
                                }).then(packageCount => {
                                    if (packageCount.length != 0) {
                                        let data = {
                                            allpackageCount: packageCount.count,
                                            todaytransaction: todaytransactionCount.count,
                                            alltransactionCount: transactionCount.count,
                                            alllikeCount: likeCount.count,
                                            allBlogCount: BlogCount.count,
                                            allUserCount: result.count,
                                            todayCount: todaycount.count,
                                        }
                                        res.json({
                                            status: 1,
                                            data: data
                                        })
                                    }
                                    else {
                                        res.json({
                                            status: 4,
                                            message: 'No Record Found'
                                        })
                                    }

                                })
                                    .catch(err => {
                                        res.json({
                                            err: err,
                                            status: 5,
                                            message: 'unable to proccess'

                                        })
                                    })
                            })
                        })
                    })

                })

            })
        });
})
//get route
//get all  user where status 0
router.get('/getallByStatus', (req, res) => {
    let results = [];
    let list = [];
    User.findAll({
        where: {
            status: 0
        },
        order: [
            ["id", "DESC"]
        ]
    }).then(user => {
        User.findAndCountAll({

        }).then(data => {
           // console.log(data.count)

            list = user;
            list.forEach((element) => {
                let userlist = {
                    id: element.id,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    email: element.email,
                    // userCount:data.count,
                    profileImg: 'http://' + req.headers.host + '/profile/' + element.profileImg,
                    status: element.status
                }

                results.push(userlist);
                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }
            })
        })

    }).catch(err => {
        res.send(err);
    });
});
router.post('/updateToken/:token', (req, res) => {
    const token = req.params.token;
    ResetPass.update(req.body, {
        where: { token: token }
    }).then(response => {
        if (res.length != 0) {
            res.json({
                status: 1,
                response: response
            })
        } else {
            res.send({
                status: 4,
                message: "Invalid token"
            })
        }
    }).catch(err => {
        res.send({
            err: err,
            status: 0,
            message: 'Invalid Link, Please regenerate another reset password link.'
        })
    });
})


//get 
//getdashboard record

router.get('/allRecord', (req, res) => {
    var list = [];
    var results = [];
    var siteList = [];
    var body;
    User.findAll({
        where: {
            status: 0
        },
        order: [
            ["id", "DESC"]
        ]
    }).then(user => {
        ManageNewsLetter.findAll({

        }).then(news => {
            ContactUs.findAll({

            }).then(contact => {
                Transaction.findAll({
                    limit: 1,

                    order: [['createdAt', 'DESC']]
                }).then(entries => {
                    Transaction.findAll({
                        include: [{
                            model: User,
                            required: true,
                        }],
                        order: [
                            ["id", "DESC"]
                        ]
                    }).then(totalTrasation => {
                        var dataall;
                        total = 0,
                            taxes = totalTrasation,
                            taxes.forEach(element => {
                                total += element.amount;
                                dataall = {
                                    amount: total,
                                }
                            })

                        User.findAndCountAll({
                        }).then(data => {

                            Website.findAll({

                            }).then(data => {
                                list = data;
                                // console.log(list)
                                list.forEach(element => {
                                    const url = 'https://api.duda.co/api/sites/multiscreen/' + element.site_name;
                                    const options = {
                                        method: 'GET',
                                        headers: { 'Content-Type': 'application/json', 'authorization': 'Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24=' },
                                    };

                                    fetch(url, options)
                                        .then(res => res.json())
                                        .then(json => {
                                            body = json
                                            results.push(body);
                                            if (list.length == results.length) {
                                                res.send({
                                                    toatalAmount: dataall,
                                                    siteList: results,
                                                    user: user,
                                                    paymentDate: entries,
                                                    count: data.count,
                                                    news: news,
                                                    contact: contact
                                                })
                                            }


                                        })
                                });
                            })
                        })
                    })
                });
            })
        })
    }).catch(err =>
        res.send({
            err: err,
            status: 5,
            message: 'Unable to process'
        }))

});
module.exports = router;