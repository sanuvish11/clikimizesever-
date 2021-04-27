var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'admin@clickimize.com',
    pass: 'Cl1ck1m1z3'
  }
});

var mailOptions = {
  from: 'admin@clickimize.com',
  to: 'sanuvish11@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});