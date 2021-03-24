module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("tbl_like_count", {
        tblUserId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER
        },
        tblBlogId: {
            type: Sequelize.INTEGER
        }
    });
    return Like;
};
