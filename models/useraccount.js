"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserAccount.hasMany(models.Transaction, { as: 'transactions', foreignKey: 'accountId' });
      UserAccount.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    }
  }
  UserAccount.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      accountType: DataTypes.STRING,
      balance: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserAccount",
      paranoid: true,
    }
  );
  return UserAccount;
};
