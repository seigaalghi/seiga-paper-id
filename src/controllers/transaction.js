const { UserAccount, Transaction } = require("../../models");
const Joi = require("joi");

// =================================================================================
// Create
// =================================================================================

exports.createTransaction = async (req, res) => {
  const body = req.body;
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      amount: Joi.number().required(),
      accountId: Joi.number().required(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const create = await Transaction.create(
      {
        ...body,
      },
      {
        attributes: { exclude: ["deletedAt"] },
      }
    );

    const account = await UserAccount.findOne({
      where: {
        id: req.body.accountId,
      },
    });

    const total = parseInt(account.dataValues.balance) + parseInt(req.body.amount);

    await UserAccount.update(
      {
        balance: total,
      },
      {
        where: {
          id: req.body.accountId,
        },
      }
    );

    const transaction = await Transaction.findOne({
      where: {
        id: create.dataValues.id,
      },
      attributes: { exclude: ["deletedAt"] },
      include: [
        {
          model: UserAccount,
          as: "account",
          attributes: { exclude: ["deletedAt"] },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Transaction created successfully",
      data: transaction,
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
// Get All
// =================================================================================

exports.getTransactions = async (req, res) => {
  const limit = 10;
  const page = req.params.page;
  const accountId = req.params.accountId;
  try {
    const accounts = await Transaction.findAndCountAll({
      limit,
      offset: limit * (page - 1),
      attributes: { exclude: ["deletedAt"] },
      where: {
        accountId,
      },
      distinct: true,
      include: [
        {
          model: UserAccount,
          as: "account",
          attributes: { exclude: ["deletedAt"] },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Accounts retrieved successfully",
      data: accounts.rows,
      meta: {
        totalPage: Math.ceil(accounts.count / limit),
        currentPage: page,
      },
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
// Get One
// =================================================================================

exports.getTransaction = async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await Transaction.findOne({
      attributes: { exclude: ["deletedAt"] },
      where: {
        id,
      },
      distinct: true,
      include: [
        {
          model: UserAccount,
          as: "account",
          attributes: { exclude: ["deletedAt"] },
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found",
        data: transaction,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Transaction retrieved successfully",
      data: transaction,
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
// Edit
// =================================================================================

exports.editTransaction = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      amount: Joi.number(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const check = await Transaction.update(
      {
        ...body,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!check) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to update transaction, please try again",
      });
    }

    const transaction = await Transaction.findOne({
      attributes: { exclude: ["deletedAt"] },
      where: {
        id,
      },
      distinct: true,
      include: [
        {
          model: UserAccount,
          as: "account",
          attributes: { exclude: ["deletedAt"] },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Transaction updated successfully",
      data: transaction,
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
// Edit
// =================================================================================

exports.deleteTransaction = async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await Transaction.destroy({
      where: {
        id,
      },
    });
    if (!transaction) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to delete the transaction",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Deleted successfully",
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
// Restore
// =================================================================================

exports.restoreTransaction = async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await Transaction.restore({
      where: {
        id,
      },
    });
    if (!transaction) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to restore the transaction",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Restored successfully",
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
