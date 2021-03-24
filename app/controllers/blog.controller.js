const express = require('express');
const config = require("../config/auth.config");
const router = express.Router();
var db = require("../models");
const multer = require('multer');
const { pathToFileURL } = require('url');
const { extname } = require('path');
const path = require("path");
const fs = require("fs");
var buffer = require('buffer');
const { compareSync } = require('bcryptjs');
const readingTime = require('reading-time');
var ManageBlog = db.manageblog;
var Like = db.like;
const Op = db.Sequelize.Op;

var storage = multer.diskStorage({
    destination: "./public/blogImage/",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
var Blog = multer({ storage: storage }).single('blogImage');

var storage = multer.diskStorage({
    destination: "./public/blogData/",
    filename: (req, file, cb) => {
        return cb(null, file.originalname)
    }
});
var Blogmain = multer({ storage: storage }).single('UploadFiles');

//POST ROUTE
// create Blog
router.post('/save', Blog, (req, res) => {
    //  console.log(req.body);
    ManageBlog.create({
        blogUrl: req.body.blogUrl,
        blogTitle: req.body.blogTitle,
        body: req.body.body,
        status: req.body.status,
        estimateTime: req.body.estimateTime,
        blogImage: req.file.filename,
        metaTag: req.body.metaTag,
        metaDescription: req.body.metaDescription
    }).then(blog => {
        // console.log(blog);
        res.send({
            status: 1,
            message: "blog create successfully"
        })
    }).catch(err => {
        res.send(err);
    });
})
//update status
router.post('/updatestatus/:id', (req, res) => {
    //   console.log(req.body);
    const id = req.params.id;
    ManageBlog.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "blog was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update blog with id=${id}. Maybe blog was not found or req.body is empty!`
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
//update blog  detail by id(1)
router.post('/update/:id', Blog, (req, res) => {
console.log(req.body)
    const id = req.params.id;
    ManageBlog.update({
        blogTitle: req.body.blogTitle,
        body: req.body.description,
        estimateTime: req.body.estimateTime,
        status: req.body.status,
        blogImage: req.file.filename,
        metaTag: req.body.metaTag,
        metaDescription: req.body.metaDescription
    }, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 1,
                message: "blog was updated successfully."
            });
        } else {
            res.send({
                status: 0,
                message: `Cannot update blog with id=${id}. Maybe blog was not found or req.body is empty!`
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
//get route
//get all  blog
router.get('/getall', (req, res) => {
    let results = [];
    let list = [];
    ManageBlog.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(blog => {
        list = blog;
        list.forEach((element) => {
            Like.findAndCountAll({
                where: {
                    tblBlogId: {
                        [Op.like]: element.id
                    }
                }
            }).then(data => {
                let blogdata = {
                    id: element.id,
                    blogUrl: element.blogUrl,
                    estimateTime: element.estimateTime,
                    // blogImage: 'http://localhost:8080/blogImage/' + element.blogImage,
                    blogImage: 'http://clickimize.us-east-1.elasticbeanstalk.com/blogImage/' + element.blogImage,
                    blogTitle: element.blogTitle,
                    body: element.body,
                    status: element.status,
                    metaTag: element.metaTag,
                    metaDescription: element.metaDescription,
                    createdAt: element.createdAt,
                    count: data.count
                };
                results.push(blogdata);
                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }
            })
        });

    })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
})

//get route
//get all  Publish Blog
router.get('/getpublish', (req, res) => {
    let results = [];
    let list = [];
    ManageBlog.findAll({
        where: {
            status: 1
        }, order: [
            ["id", "DESC"]
        ]
    }).then(blog => {
        list = blog;
        list.forEach((element) => {
            Like.findAndCountAll({
                where: {
                    tblBlogId: {
                        [Op.like]: element.id
                    }
                }
            }).then(data => {
                // console.log(data.count);
                let blogdata = {
                    id: element.id,
                    blogUrl: element.blogUrl,
                    estimateTime: element.estimateTime,
                    // blogImage: 'http://localhost:8080/blogImage/' + element.blogImage,
                    blogImage: 'http://clickimize.us-east-1.elasticbeanstalk.com/blogImage/' + element.blogImage,
                    blogTitle: element.blogTitle,
                    body: element.body,
                    status: element.status,
                    metaTag: element.metaTag,
                    metaDescription: element.metaDescription,
                    createdAt: element.createdAt,
                    count: data.count
                };
                results.push(blogdata);
                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }
            })
        });

    })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
})
//get one Publish Blog BolgUrl
router.get('/getByBlogUrl/:id', (req, res) => {
    const id = req.params.id;
    ManageBlog.findOne({
        where: {
            blogUrl: id
        }
    }).then(blog => {
        Like.findAndCountAll({
            where: {
                tblBlogId: {
                    [Op.like]: blog.id
                }
            }
        }).then(data => {
            let blogdata = {
                id: blog.id,
                blogUrl: blog.blogUrl,
                estimateTime: blog.estimateTime,
                // blogImage: 'http://localhost:8080/blogImage/' + blog.blogImage,
                blogImage: 'http://clickimize.us-east-1.elasticbeanstalk.com/blogImage/' + blog.blogImage,
                blogTitle: blog.blogTitle,
                body: blog.body,
                status: blog.status,
                metaTag: blog.metaTag,
                metaDescription: blog.metaDescription,
                createdAt: blog.createdAt,
                count: data.count
            }
            if (blogdata.length != 0) {
                res.json({
                    status: 1,
                    blogdata: blogdata
                })
            } else {
                res.send({
                    status: 4,
                    message: "No Record Found"
                })
            }

        })

    })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
})
//get record by 
router.get('/getById/:id', (req, res) => {
    const id = req.params.id;
    ManageBlog.findOne({
        where: {
            id: id
        }
    }).then(blog => {
        Like.findAndCountAll({
            where: {
                tblBlogId: {
                    [Op.like]: blog.id
                }
            }
        }).then(data => {
           // console.log(data);
            let blogdata = {
                id: blog.id,
                blogUrl: blog.blogUrl,
                estimateTime: blog.estimateTime,
                // blogImage: 'http://localhost:8080/blogImage/' + element.blogImage,
                blogImage: 'http://clickimize.us-east-1.elasticbeanstalk.com/blogImage/' + blog.blogImage,
                blogTitle: blog.blogTitle,
                body: blog.body,
                status: blog.status,
                metaTag: blog.metaTag,
                metaDescription: blog.metaDescription,
                createdAt: blog.createdAt,
                count: data.count
            }
            if (blogdata.length != 0) {
                res.json({
                    status: 1,
                    blogdata: blogdata
                })
            } else {
                res.send({
                    status: 4,
                    message: "No Record Found"
                })
            }

        })

    })
        .catch(err => {
            res.send({
                err: err,
                status: 5,
                message: "unable to proccess"
            });
        });
})
//get blog by Id
router.get('/getBlogByTag/:metaTag', (req, res) => {
   // console.log(req.body);
    const metaTag = req.params.metaTag;
    let list = [];
    let results = [];
    ManageBlog.findAll({
        where: {
            metaTag: metaTag
        }, order: [
            ["id", "DESC"]
        ]
    }).then(blog => {
        list = blog;
        list.forEach(element => {
            if (element.length != 0) {
                let blogdata = {
                    id: element.id,
                    estimateTime: element.estimateTime,
                    blogImage: 'http://clickimize.us-east-1.elasticbeanstalk.com/blogImage/' + element.blogImage,
                    // blogImage: 'http://localhost:8080/blogImage/' + element.blogImage,
                    // name: blog.name,
                    blogTitle: element.blogTitle,
                    body: element.body,
                    status: element.status,
                    metaTag: element.metaTag,
                    metaDescription: element.metaDescription
                }

                results.push(blogdata);

                if (list.length == results.length) {
                    res.send(Array.prototype.concat.apply([], results))
                }
            }
        })
    })
        .catch(err => {
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
    ManageBlog.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    status: 1,
                    message: "blog was deleted successfully!"
                });
            } else {
                res.send({
                    status: 0,
                    message: `Cannot blog  with id=${id}. Maybe blog was not found!`
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


router.post('/saveImage', Blogmain, (req, res) => {
   console.log(req.body)
    res.send({
        status: 1,
        message: "Image Saved"
    });
});
router.get('/getBlogId/:id', (req, res) => {
 //   console.log(req.body);
    const id = req.params.id;
    ManageBlog.findOne({
        where: {
            id: id
        }
    }).then(blog => {
        let blogdata = {
            id: blog.id,
            estimateTime: blog.estimateTime,
            blogImage: 'http://clickimize.us-east-1.elasticbeanstalk.com/blogImage/' + blog.blogImage,
            // blogImage: 'http://localhost:8080/blogImage/' + blog.blogImage,
            // name: blog.name,
            blogTitle: blog.blogTitle,
            body: blog.body,
            status: blog.status,
            metaTag: blog.metaTag,
            metaDescription: blog.metaDescription
        }
        if (blogdata.length != 0) {
            res.json({
                status: 1,
                blogdata: blogdata
            })
        } else {
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
        });
})
module.exports = router;