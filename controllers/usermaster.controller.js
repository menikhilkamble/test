const db = require("../models");
const UserMasters = db.usermasters;
const WhereBuilder = require('../helpers/WhereBuilder');
var HTTPError = require('http-errors');
var sendMail = require('../helpers/mailer');

exports.create = async (req, res, next) => {
  var { email } = req.body;
  
  if (!email) {
    return next(HTTPError(500, "UserMaster not created, email field is empty"));
  }

  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if(!emailRegexp.test(email)){
    return next(HTTPError(500, "UserMaster not created, email field is invalid")); 
  }

  var usermaster;
  try {
    usermaster = await UserMasters.create({
      email: email,
      status: true,
    });
    if (!usermaster) {
      return next(HTTPError(500, "UserMaster not created"))
    }
    // await sendMail.sendMail(email);
  } 
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else if(err["original"]){
      return next(HTTPError(500, err["original"]["detail"]));
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the usermaster."))
    }
  }

  usermaster = usermaster.toJSON();
  req.responseData = usermaster;
  next();
};

exports.getAll = async (req, res, next) =>{
  var { email, status } = req.query;

  var whereClause = new WhereBuilder()
  .clause('email', email)
  .clause('status', status).toJSON();

  var getAllUserMaster = await UserMasters.findAll({
    where:whereClause
  });
  
  if (!getAllUserMaster[0]) {
    return next(HTTPError(400, "UserMaster not found"));
  }
  
  getAllUserMaster = getAllUserMaster.map ( el => { return el.get({ plain: true }) } );
  req.getAllUserMaster = getAllUserMaster;
  req.responseData = getAllUserMaster;
  next();
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  var { email, description, status } = req.body;

  var whereClause = new WhereBuilder()
  .clause('email', email)
  .clause('status', status).toJSON();

  try{
    var updatedUserMaster = await UserMasters.update(whereClause,{
      where: {
        id: id
      }
    });

    if (!updatedUserMaster) {
      return next(HTTPError(500, "UserMaster not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else if(err["original"]){
      return next(HTTPError(500, err["original"]["detail"]));
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the usermaster."))
    }
  }

  req.updatedUserMaster = updatedUserMaster;
  req.responseData = updatedUserMaster;
  next();
};

exports.getById = async (req, res, next) => {

  const { id } = req.params;

  var foundUserMaster = await UserMasters.findByPk(id);
  if (!foundUserMaster) {
    return next(HTTPError(500, "UserMaster not found"))
  }
  req.foundUserMaster = foundUserMaster;
  req.responseData = req.foundUserMaster;
  next();
}
