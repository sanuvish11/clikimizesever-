const express = require('express');
const config = require("../config/auth.config");
const router = express.Router();
var db = require("../models");



var UserNotification = db.usernotification;
const Op = db.Sequelize.Op;

//update Notification  by id(1)
router.post('/update/:id', (req, res) => {
    //console.log(req.params)
    const id = req.params.id;

    UserNotification.update(req.body, {
        where: { tblUserId: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "Notification  was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update Notification  with id=${id}. Maybe  Notification  was not found or req.body is empty!`
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
//View Record By id
router.get('/getUserNotification/:id', (req, res) => {
    const id = req.params.id;
    UserNotification.findAll({
        where: {
            tblUserId: id,
            status: 1
        }
    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                data: data
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
            message: "unable to proccess"
        });
    });
})
//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    Notification.destroy({
        where: { tblUserId: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "Notification was deleted successfully!"
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot Notification with id=${id}. Maybe Notification was not found!`
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
//notification list
router.get('/notificationlist/:id', (req, res) => {
    const id = req.params.id;
    UserNotification.findAll({
        where: {
            tblUserId: id,
        }
    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                data: data
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
            message: "unable to proccess"
        });
    });
})

module.exports = router;