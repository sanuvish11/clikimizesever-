module.exports = (sequelize, Sequelize) => {
    const AddToFavorite = sequelize.define("tbl_add_to_favorite", {
        templateId: {
            type: Sequelize.INTEGER
        },
        tblUserId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER
        },

    });
    return AddToFavorite;
};
