"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.UserAccount, { as: 'account', foreignKey: 'accountId' });
    }
  }
  Transaction.init(
    {
      accountId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
      paranoid: true,
    }
  );
  return Transaction;
};
