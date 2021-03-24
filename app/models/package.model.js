module.exports = (sequelize, Sequelize) => {
    const Package = sequelize.define("tbl_package", {
        packageName: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        tblPackageTypeId: {
            type: Sequelize.INTEGER
        }
    });
    return Package;
};
