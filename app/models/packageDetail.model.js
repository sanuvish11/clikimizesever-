module.exports = (sequelize, Sequelize) => {
    const PackageDetails = sequelize.define("tbl_package_detail", {

        packageDetail: {
            type: Sequelize.STRING
        },
        packagePrice: {
            type: Sequelize.FLOAT
        },
        packageDuration: {
            type: Sequelize.STRING
        },
        packageName: {
            type: Sequelize.STRING
        },
        packageStatus: {
            type: Sequelize.INTEGER
        },
        tblPackageTypeId: {
            type: Sequelize.INTEGER
        },
        numberofSite: {
            type: Sequelize.INTEGER
        }

    });
    return PackageDetails;
};