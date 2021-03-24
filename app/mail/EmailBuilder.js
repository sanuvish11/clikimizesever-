var MailMessage = require('./MailMessage');

/**
 * Email builder creates email messages for application. 
 */

class EmailBuilder {

    /**
     * Get signup message 
     */



    static getUserRegisterUpMessage(mailBody, subject) {

        var mailMsg = new MailMessage();
        mailMsg.subject = subject;
        mailMsg.message = mailBody;

        return mailMsg;
    }

    /**
     * Get forgot password message
     * @param {*} map 
     */
    static getForgetPasswordMessage(mailBody, subject) {

        var mailMsg = new MailMessage();

        mailMsg.subject = subject;

        // var msg = '' ;
        // msg += "<HTML><BODY>";

        mailMsg.message = mailBody; //msg;

        return mailMsg;
    }

    /**
     * Get Changepassword message
     * @param {*} map 
     */
    static getChangePasswordMessage(map) {

        var mailMsg = new MailMessage();

        mailMsg.subject = 'Hi' + map.adminName + ' your password is changed!!';

        var msg = '';
        msg += "<HTML><BODY>";
        msg += "<H1>Your Password has been changed Successfully !! " + map.adminName + "</H1>";

        msg += "<P><B>To access account user Login Id : " +
            map.admiEmail + "<BR>" + " Password : " +
            map.adminPass + "</B></p>";
        msg += "</BODY></HTML>";

        mailMsg.message = msg;

        return mailMsg;
    }


    /**
     * Get getContactMessage message
     * @param {*} map 
     */
    static getContactMessage(mailbody, subject) {

        var mailMsg = new MailMessage();
        mailMsg.subject = subject;
        // mailMsg.subject = map.firstName;
        // var msg = '';
        // msg += "<HTML><BODY>";
        // msg += "<H1>Hi! Greetings from clickimize !</H1>";
        // msg += "Thank You for Contact us  https://clickimize.com/";
        // msg += "<img src=" + '/public/blogImage/blogImage_1612940544787.png' + ">";
        // msg += "<P><B>Your Email: " + map.email + "<BR>" + "</B></p>";
        // msg += "<P> Name: " + map.firstName + "   " + map.lastName + "<BR>" + "</p>";
        // msg += "<P><B> Message: " + map.message + "<BR>" + "</B></p>";
        // msg += "<p>For any assistance, please feel free to call us at +91 98273 45214 or 2451-4516587 helpline numbers.</p>";
        // msg += "<p>You may also write to us at https://clickimize.com/</p>";
        // msg += "<p>We assure you the best service at all times and look forward to a warm and long-standing association with you.</p>";
        // msg += "</BODY></HTML>";
        mailMsg.message = mailbody;
        return mailMsg;
    }

    /**
     * Get getContactMessage message
     * @param {*} map 
     */
    static ReplyContactMessage(mailBody) {

        var mailMsg = new MailMessage();
        // mailMsg.subject = map.firstName;
        // msg += "<HTML><BODY>";
        // msg += "<H1>Hi! Greetings from clickimize !</H1>";
        // msg += "Thank You for Contact us  https://clickimize.com/";
        // msg += "<P><B>Your Email: " + map.email + "<BR>" + "</B></p>";
        // msg += "<P> Name: " + map.firstName + "   " + map.lastName + "<BR>" + "</p>";
        // msg += "<P><B> Message: " + map.replyMessage + "<BR>" + "</B></p>";
        // msg += "<p>For any assistance, please feel free to call us at +91 98273 45214 or 2451-4516587 helpline numbers.</p>";
        // msg += "<p>You may also write to us at https://clickimize.com/</p>";
        // msg += "<p>You may also write to us at https://clickimize.com/</p>";
        // msg += "<p>We assure you the best service at all times and look forward to a warm and long-standing association with you.</p>";
        // msg += "</BODY></HTML>";
        mailMsg.message = mailBody;
        return mailMsg;
    }



    /*get news Lattrers message*/
    static getNewsLattersMessage(mailBody, subject) {

        var mailMsg = new MailMessage();

        mailMsg.subject = subject;

        mailMsg.message = mailBody;
        return mailMsg;
    }
    static getPrivateMessage(map) {

        var mailMsg = new MailMessage();

        mailMsg.subject = map.subject;
        var msg = map.message;
        mailMsg.message = msg;
        return mailMsg;
    }
}
//Export to module 
module.exports = EmailBuilder;