module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("tbl_users", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        profileImg: {
            type: Sequelize.STRING
        },
        userType: {
            type: Sequelize.INTEGER
        },
        ipAddress: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        mobileNumber: {
            type: Sequelize.STRING
        },
        address:{
            type: Sequelize.STRING
        }
    });
    return User;
};
  // gender: {
        //     type: Sequelize.STRING
        // },
        // mobileNumber: {
        //     type: Sequelize.TEXT
        // },
        // country: {
        //     type: Sequelize.STRING
        // },
        // state: {
        //     type: Sequelize.STRING
        // },
        // city: {
        //     type: Sequelize.STRING
        // },
