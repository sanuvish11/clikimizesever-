module.exports = (sequelize, Sequelize) => {
  const PrivateMessage = sequelize.define("tbl_private_message", {
    email: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING
    }
  });
  return PrivateMessage;
};