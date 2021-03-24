
module.exports = (sequelize, Sequelize) => {
    const ManageTransaction = sequelize.define("tbl_manage_transaction", {
        tblUserId: {
            type: Sequelize.INTEGER,
        },
        paymentMode: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT
        },
        paymenDate: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.INTEGER
        },
        transactionRef: {
            type: Sequelize.STRING
        },
        transactionId: {
            type: Sequelize.STRING
        }
    });
    return ManageTransaction;
};
