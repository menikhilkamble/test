var nodemailer = require ('nodemailer'); 
var smtpTransport = require('nodemailer-smtp-transport');

const db = require("../models");
const UserMasters = db.usermasters;

exports.sendMail = async (toMail) => {
  var getAllUserMaster = await UserMasters.findAll({
  });
  
  if (!getAllUserMaster[0]) {
    console.log("No Email Data");
  }
  
  else{
    getAllUserMaster = getAllUserMaster.map ( el => { return el.get({ plain: true }) } );

    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: '*****@gmail.com',
        pass: '******'
      }
    }));


    for(var i = 0; i < getAllUserMaster.length; i++){
      var mailOptions = {
        from: 'Nikhil',
        to: getAllUserMaster[i]["email"],
        subject: 'Test Mail',
        text: 'Auto Email'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });  
    }

  }
  
}