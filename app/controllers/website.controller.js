const express = require('express');
const router = express.Router();
var db = require("../models");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const fetch = require('node-fetch');
const sequelize = require('sequelize');

var Website = db.website;
var PackageDetail = db.packagedetail;
var User = db.user;
var Template = db.template;
const Op = db.Sequelize.Op;
var UserPackage = db.userpackage;
var PackageType = db.packageType;
//POST ROUTE
//website create 
router.post('/save', (req, res) => {
    //console.log(req.body);
    const packId = req.body.packageDetailId;
    const uid = req.body.userId;
    var userCount;
    var siteCount;
    PackageDetail.findOne({
        where: {
            id: packId
        }
    }).then(template => {

        siteCount = template.numberofSite;

        Website.findAndCountAll({
            where: {
                userId: uid,
                // packageDetailId: req.body.packageDetailId
            }
        }).then(data => {
            //  console.log(data.count)
            userCount = data.count;
            if (siteCount == userCount) {
                res.send({
                    message: 'you reached limit',
                    status: 6
                })
            }
            else {
                const url = 'https://api.duda.co/api/sites/multiscreen/create';
                const options = {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'authorization': 'Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24=' },
                    body: JSON.stringify({
                        template_id: req.body.template_id,
                        "default_domain_prefix": req.body.default_domain_prefix,
                        "lang": req.body.lang,
                        "site_data": req.body.site_data,
                    })
                };
                fetch(url, options).then(res =>
                    res.json()).then(data => {
                        //  console.log(data);
                        resjosn = data
                        Website.create({
                            templateId: req.body.template_id,
                            userId: req.body.userId,
                            packageDetailId: req.body.packageDetailId,
                            status: req.body.status,
                            site_name: resjosn.site_name
                        })
                            .then(data => {
                                if (data != null) {
                                    res.send({
                                        status: 1,
                                        data: data,
                                        message: "website create successfully"
                                    })
                                }
                            })
                            .catch(err =>
                                console.error('error:' + err));

                    }).catch(err => {
                        //console.log(err);
                        res.send({
                            status: 5,
                            err: err,
                            message: "unable to process"
                        });
                    })
            }
        })
    })
})



//update package detail by id(1)
router.post('/reset/:id', (req, res) => {
    const id = req.params.id;
    Website.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "website Reset was updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update website with id=${id}. Maybe User website was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            //  console.log(err)
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess=" + id
            });
        });
})

//get route
//get all record website list user
router.get('/getall', (req, res) => {
    Website.findAll({})
        .then(data => {
            if (data.length != 0) {
                res.send({
                    status: 1,
                    data: data
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
router.delete('/delete/:site_name', (req, res) => {
    const site_name = req.params.site_name;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24='
        },
    };
    const url = 'https://api.duda.co/api/sites/multiscreen/' + site_name;

    fetch(url, options)
        .then(data => {
            if (data.length != 0) {
                Website.destroy({
                    where: { site_name: site_name }
                }).then(data => {
                    res.json({
                        status: 1,
                        message: "Website Delete Successfully"
                    })
                })
            }
            else {
                res.send({
                    status: 4,
                    message: "No Record Found"
                })
            }

        })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        })
});
//get singal purchase plan
router.get('/websiteList/:id', (req, res) => {
    const id = req.params.id;
    var list = [];
    var results = [];
    var body;
    Website.findAll({
        where: {
            userId: id
        }
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
                        res.send(Array.prototype.concat.apply([], results))
                    }
                    else {
                        res.send({
                            status: 4
                        })
                    }
                }).catch(err => {
                    res.send({
                        err: err,

                        message: 'Unable to proccess'
                    });
                });
        });
    })
})

router.post('/resteSite/:site_name', (req, res) => {
    const site_name = req.params.site_name;
    const url = 'https://api.duda.co/api/sites/multiscreen/reset/' + site_name;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24='
        },
        body: JSON.stringify({
            template_id: req.body.template_id
        })
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
})
router.post('/test/:site_name', (req, res) => {
    const site_name = req.params.site_name;
    const url = 'https://api.duda.co/api/sites/multiscreen/update/' + site_name;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24='
        },
        body: JSON.stringify({
            template_id: req.body.template_id

        })
    };
    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
})


router.get('/allWebsite', (req, res) => {
    const id = req.params.id;
    var list = [];
    var results = [];
    var body;
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
                        res.send(Array.prototype.concat.apply([], results))
                    }
                }).catch(err => console.error('error:' + err));
        });
    })
})



router.get('/userWisePackageSiteDetail', (req, res) => {

    var list = [];
    var list1 = [];
    var results = [];
    var packageList = [];
    Website.findAll({
    }).then(data => {
        list = data;
        list.forEach(element => {
            User.findAll({
                where: {
                    id: element.userId
                }
            }).then(userRes => {
                list1 = userRes;
                list1.forEach(element1 => {
                    PackageDetail.findAll({
                        where: {
                            id: element.packageDetailId
                        }
                    }).then(packge => {
                        list1 = packge
                        list1.forEach(element2 => {
                            UserPackage.findAll({
                                where: {
                                    tblUserId: element.userId,
                                    tblPackageDetailId: element.packageDetailId
                                }
                            }).then(packgeExp => {
                                packageList = packgeExp
                                packageList.forEach(el => {

                                    const userlist = {
                                        id: element1.id,
                                        site_name: element.site_name,
                                        firstName: element1.firstName,
                                        lastName: element1.lastName,
                                        email: element1.email,
                                        packgeName: element2.packageName,
                                        expDate: el.endDate
                                    }
                                    results.push(userlist);
                                    // console.log(results)
                                    if (list.length == results.length) {
                                        res.send(Array.prototype.concat.apply([], results))
                                    }
                                })
                            })
                        })
                    })
                })
            })
        });

    })
})





///testing site changes
router.post('/testsite', (req, res) => {
    //console.log(req.body);
    var list = [];
    var results = [];
    var pkgList = []
    const packId = req.body.packageDetailId;
    const uid = req.body.userId;
    console.log(req.body);
    UserPackage.findAll({
        where: {
            tblUserId: uid,
            tblPackageDetailId: packId
        }
    }).then(userpkg => {
        list = userpkg;
        list.forEach(el => {
            PackageDetail.findAll({
                where: {
                    id: el.tblPackageDetailId
                },
                attributes: [
                    'numberofSite',
                    [sequelize.fn('SUM', sequelize.col('numberofSite')), 'total_count']
                ]
            }).then(data => {
                const pkg = {
                    data: data
                }
                results.push(pkg)
                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }
            })
        })







        //  res.send(template);
    })
})





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
                                list2 = packtype;
                                let counter=1;
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

                                    if(counter==1){
                                        userpackage.websiteCount =4;
                                    counter = 2;
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
        console.log(err)
        res.send({
            err: err,
            status: 5,
            message: 'unable to process'
        })
    })
})

module.exports = router;
