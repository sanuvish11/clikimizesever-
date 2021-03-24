const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./app/routes/routes");
const app = express();
app.use(cors(corsOptions));
app.use(express.static(__dirname + "./public"));


var corsOptions = {
    origin: "*",
    corsOptions: 200
};
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Methods →GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
        "image/jpeg"
    );
    next();
});


global.__basedir = __dirname;
app.use(cors(corsOptions));

app.use(express.static(__dirname + "./public/index.html"));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

require('./app/routes/routes')(app)

app.get("/", function (req, res) {
    res.send('welcome to clikimize application')
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

