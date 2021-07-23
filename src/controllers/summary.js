const { Transaction } = require("../../models");
const sequelize = require("sequelize");

// =================================================================================
// Daily Summary
// =================================================================================
exports.getSummaryDaily = async (req, res) => {
  const id = req.params.accountId;
  try {
    const account = await Transaction.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: ["date"],
    });

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
        data: account,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Account retrieved successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};

// =================================================================================
// Monthly
// =================================================================================
exports.getSummaryMonthly = async (req, res) => {
  const id = req.params.accountId;
  try {
    const account = await Transaction.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: ["month"],
    });

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
        data: account,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Account retrieved successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};
