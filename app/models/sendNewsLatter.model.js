module.exports = (sequelize, Sequelize) => {
    const SendNewsLatter = sequelize.define("tbl_send_news_latter", {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        status:{
            type:Sequelize.INTEGER 
        }

    });
    return SendNewsLatter;
};
