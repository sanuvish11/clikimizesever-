module.exports = (sequelize, Sequelize) => {
    const UserPackage = sequelize.define("tbl_user_packages", {
        tblUserId: {
            type: Sequelize.INTEGER
        },
        tblPackageDetailId: {
            type: Sequelize.INTEGER
        },
        packageName: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATE
        },
        endDate: {
            type: Sequelize.DATE
        },
        status:{
            type: Sequelize.INTEGER
        }
    });
    return UserPackage;
};
