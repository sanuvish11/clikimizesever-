const express = require('express');
const config = require("../config/auth.config");
const router = express.Router();
var db = require("../models");
var Transaction = db.transaction;
var PackageDetail = db.packagedetail;
var UserPackage = db.userpackage;
var User = db.user;
var Notification = db.notification;
const Op = db.Sequelize.Op;

const Stripe = require('stripe');
// const stripe = Stripe('sk_test_51IMtrpHOr6CjjjlHeAbDmagCFqND6n79hz1UtQ6fEmKg5NY3dH26qkoMs4ePvpDlyPGImXilkqddcOQtRrY3gnaz00RaBZd16B');

router.post('/paymenttest', (req, res) => {
    console.log("**************************************************");
    getToken(req, res);
});

async function getToken(req, res) {
    var packageName = req.body.packageName;
    var packagePrice = req.body.packagePrice;
    // console.log(req.body)
    const stripe = require('stripe')('sk_test_51EBYsOCM7qY2Kwa3lqDQuweNRpNqrCIxKV8UXJczzY0vAtqPJPJw5IRUO3BkWni9vGc330B7rq0WM9bU0PFviZSf00CGjnQ8jP');
    //  console.log(payment)

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'USD',
                product_data: {
                    name: packageName,
                },
                unit_amount: packagePrice * 100,
            },
            quantity: 1,
        },],
        mode: 'payment',
        success_url: "http://localhost:4201/success/{CHECKOUT_SESSION_ID}",
        cancel_url: 'http://localhost:4201/failure',
    });

    res.json({ id: session?.id });
};



router.post('/retrieveSession', (req, res) => {
    console.log("**************************************************");
    getSession(req, res);
});


async function getSession(req, res) {
    console.log(req.body);
    var sessionID = req.body.session_id;
    var userId = req.body.userId;
    var amount = req.body.packagePrice;
    const stripe = require('stripe')('sk_test_51EBYsOCM7qY2Kwa3lqDQuweNRpNqrCIxKV8UXJczzY0vAtqPJPJw5IRUO3BkWni9vGc330B7rq0WM9bU0PFviZSf00CGjnQ8jP');
    //  console.log(payment)

    const session = await stripe?.checkout.sessions.retrieve(sessionID);
    const customer = await stripe?.customers.retrieve(session.customer);
    // const charges = await stripe.charges.retrieve(customer.id, { expand: ['customer', 'invoice.subscription'], });
    const checkout = await stripe.checkout.sessions.listLineItems(
        req.body.session_id,
        { limit: 5 },
        function (err, lineItems) {
            console.log(lineItems)
            // asynchronously called
        }
    )
    console.log(checkout)
    // console.log(customer);
    await Transaction.create({
        tblUserId: userId,
        paymentMode: "online",
        paymenDate: new Date(),
        amount: amount,
        status: 1,
        transactionRef: sessionID,
        transactionId: customer.id
    }).then(data => {
        PackageDetail.findOne({
            where: {
                id: req.body.tblPackageDetailId
            }
        }).then(data => {
            if (data.length != 0) {
                var d = new Date();
                let nMonths = data.packageDuration / 30;
                let month = Math.ceil(nMonths);
                UserPackage.create({
                    tblUserId: req.body.tblUserId,
                    tblPackageDetailId: req.body.tblPackageDetailId,
                    packageName: req.body.packageName,
                    status: 1,
                    startDate: Date.now(),
                    endDate: d.setMonth(month + 1),
                }).then(userpakage => {
                    var myJSON = {
                        id: userpakage.tblUserId,
                        message: userpakage.packageName
                    }
                    const myObjStr = JSON.stringify(myJSON);
                    //  console.log(myObjStr);
                    Notification.create({
                        title: "purchase new package",
                        content: myObjStr,
                        type: "package",
                        status: 1
                    }).then(data => {

                    })

                })
            }
            else {
                res.send({
                    status: 5,
                    message: 'transaction fail'
                })
            }
        })


    }).catch(err => {
        res.send({
            err: err,
            status: 1,
            message: 'unable to proccess'
        })
        console.log(err)
    });


    res.json({ data: customer });


};


router.post('/save', (req, res) => {

    Transaction.create({
        tblUserId: req.body.tblUserId,
        paymentMode: req.body.paymentMode,
        paymenDate: req.body.paymenDate,
        status: req.body.status,
        transactionRef: req.body.transactionRef,
        transactionId: req.body.transactionId
    }).then(transaction => {
        res.json({
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
})
// })
//})


//update package detail by id(1)
router.post('/update/:id', (req, res) => {
    const id = req.body.id;
    Transaction.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "transition updated successfully."
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot update transition with id=${id}. Maybe transition was not found or req.body is empty!`
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

//get routes
//get all record form userpackage with join packagedetai and user detail
router.get('/getall', (req, res) => {
    Transaction.findAll({

        include: [{
            model: User,
            required: true,
        }],
        order: [
            ["id", "DESC"]
        ]
    })
        .then(data => {
            if (data.length != 0) {
                res.json({
                    data: data,
                    status: 1,
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
    Transaction.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "Transaction was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`
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
//get total transition
//get api
router.get('/getallPayment', (req, res) => {
    Transaction.findAll({

        include: [{
            model: User,
            required: true,
        }],
        order: [
            ["id", "DESC"]
        ]
    })
        .then(data => {
            var dataall
            total = 0, //set a variable that holds our total
                taxes = data, //reference the element in the "JSON" aka object literal we want
                taxes.forEach(element => {
                    total += element.amount;
                    dataall = {
                        tblUserId: element.tblUserId,
                        paymentMode: element.paymentMode,
                        paymenDate: element.paymenDate,
                        status: element.status,
                        amount: total,
                        transactionRef: element.transactionRef,
                        transactionId: element.transactionId
                    }
                });

            //console.log(total);
            if (data.length != 0) {

                res.json({
                    data: dataall,
                    status: 1,
                })
            } else {
                res.json({
                    status: 4,
                    message: "No Record Found"
                })
            }

        }).catch(err => {
            res.send(err)
            // res.send({
            //     err: err,
            //     status: 5,
            //     message: "unable to proccess"
            // });
        });
})

router.get('/getTransactionByUserId/:id', (req, res) => {
    const id = req.params.id;
    Transaction.findAll({
        where: {
            tblUserId: id
        },
        order: [
            ["id", "DESC"]
        ]
    })
        .then(data => {
            if (data.length != 0) {
                res.json({
                    data: data,
                    status: 1,
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


module.exports = router;