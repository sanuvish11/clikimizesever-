
module.exports = (sequelize, Sequelize) => {
    const NewsLetter = sequelize.define("tbl_news_latter", {
        email: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    return NewsLetter;
};
