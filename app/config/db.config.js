module.exports = {
    HOST: "clickimizeprod.c6m22hq2avoe.us-east-1.rds.amazonaws.com",
    USER: "root",
    PASSWORD: "roottoor",
    // HOST: "localhost",
    // USER: "root",
    // PASSWORD: "root",
    DB: "clickimize",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};