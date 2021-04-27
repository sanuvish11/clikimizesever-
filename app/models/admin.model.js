module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("tbl_admins", {
    adminName: {
      type: Sequelize.STRING
    },
    adminEmail: {
      type: Sequelize.STRING
    },
    ipAddress: {
      type: Sequelize.STRING
    },
    adminPass: {
      type: Sequelize.STRING
    },
    profileImg: {
      type: Sequelize.STRING
    },
    adminType: {
      type: Sequelize.STRING
    },
    permissions: {
      type: Sequelize.INTEGER
    },

    isActive: {
      type: Sequelize.INTEGER
    },
    created_date: {
      type: 'TIMESTAMP',
      allowNull: false
    },
    updated_date: {
      type: 'TIMESTAMP',
      allowNull: false
    }
  },
    {
      timestamps: true,
      createdAt: false,
      updatedAt: false
    });


  return Admin;
};
