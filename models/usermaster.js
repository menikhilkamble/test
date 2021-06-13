'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserMaster = sequelize.define("usermaster", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  });

  return UserMaster;
};