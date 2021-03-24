module.exports = (sequelize, Sequelize) => {
    const ManagBlog = sequelize.define("tbl_blog", {
        blogUrl: {
            type: Sequelize.STRING
        },
        blogTitle: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        blogImage: {
            type: Sequelize.STRING
        },
        metaTag: {
            type: Sequelize.STRING
        },
        metaDescription: {
            type: Sequelize.STRING
        },
        estimateTime:{
            type: Sequelize.STRING
        }
    });
    return ManagBlog;
};
