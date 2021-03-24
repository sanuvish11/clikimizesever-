const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Admin = db.admin;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  //console.log(token)
  var tokensite = token.replace("124abcdkamal", ".");
  if (!token) {
    return res.status(403).send({
      message: "Jwt Token Missing!"
    });
  }
  jwt.verify(tokensite, config.secret, (err, decoded) => {
    //console.log(token)
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};
//
isAdmin = (req, res, next) => {
  Admin.findByPk(req.userId).then(user => {
    if (user.adminType === "super") {
      next();
      return;
    }
    res.status(403).send({
      message: "No Token Provide"
    });

  });
};

//admin verify
isUser = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    const roleid = user.roleId;
    Role.findByPk(roleid).then(roles => {
      if (roles.name === "user") {
        next();
        return;
      }
      res.status(403).send({
        message: "No Token Provide"
      });
    })
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isUser: isUser,
};
module.exports = authJwt;
