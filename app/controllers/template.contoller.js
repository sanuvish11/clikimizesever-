const express = require('express');

var db = require("../models");

const router = express.Router();
var Template = db.template;
const Op = db.Sequelize.Op;
//POST ROUTE
// create like 
// router.post('/save', (req, res) => {
//     Like.findOne({
//         where: {
//             tblUserId: req.body.tblUserId,
//             tblBlogId: req.body.tblBlogId,
//         }
//     }).then(data => {
//         if (data) {
//             res.send({
//                 status: 2,
//                 message: "Like already Exits!"
//             });
//             return;
//         }
//         Like.create({
//             tblUserId: req.body.tblUserId,
//             tblBlogId: req.body.tblBlogId,
//             status: req.body.status,
//         }).then(data => {
//             ManageBlog.findOne({
//                 where: {
//                     id: data.tblBlogId
//                 }
//             }).then(blogres => {
//                 var myJSON = {
//                     id: blogres.id,
//                     message: blogres.blogTitle
//                 }
//                 const myObjStr = JSON.stringify(myJSON);
//                 console.log(myObjStr);
//                 Notification.create({
//                     title: "Blog Like ",
//                     content: myObjStr,
//                     type: "blog",
//                     status: 1
//                 }).then(data => {
//                     res.send({
//                         status: 1,
//                         message: "You have Successfully like this page"
//                     })
//                 })
//             })


//         })
//             .catch(err => {
//                 res.send(err);
//             });
//     })
// });
//get all temmplates
router.get('/getAllTemplate', (req, res) => {
    Template.findAll({

    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                data: data
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
})
//delete routes
//delete record by id
router.delete('/delete/:id', (req, res) => {
    const id = req.body.id;
    Like.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "like  was Remove successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot like  with id=${id}. Maybe like was not found!`
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


//filter record by color
router.get('/getColorFilter/:color', (req, res) => {
    //console.log(req.params)
    const color = req.params.color;
    Template.findAll({
        where: {
            colors: {
                [Op.like]: "%" + color + "%"
            }
        }
    }).then(data => {
        if (data.length != 0) {
            res.json({
                status: 1,
                data: data
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
})
//template filter apply
router.get('/getCategaryFilter/:category', (req, res) => {
    //console.log(req.params)
    const category = req.params.category;
    Template.findAll({
        where: {
            verticals: {
                [Op.like]: "%" + category + "%"
            }
        }
    }).then(data => {
       // console.log(data)
        if (data.length != 0) {
            res.json({
                status: 1,
                data: data
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
})
module.exports = router;