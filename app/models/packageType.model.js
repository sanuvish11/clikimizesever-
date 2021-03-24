module.exports = (sequelize, Sequelize) => {
    const packageType = sequelize.define("tbl_package_type", {
  
      name: {
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.INTEGER
      }
    });
  
    return packageType;
  };
  