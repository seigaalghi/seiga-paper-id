const { UserAccount, Transaction } = require("../../models");
const Joi = require("joi");

// =================================================================================
// Create
// =================================================================================

exports.createAccount = async (req, res) => {
  const body = req.body;
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),
      accountType: Joi.string().required(),
      balance: Joi.number().required(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const account = await UserAccount.create(
      {
        ...body,
        userId: req.user.id,
      },
      {
        attributes: { exclude: ["deletedAt"] },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Account created successfully",
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
// Get All
// =================================================================================

exports.getAccounts = async (req, res) => {
  const limit = 10;
  const page = req.params.page;
  try {
    const accounts = await UserAccount.findAndCountAll({
      limit,
      offset: limit * (page - 1),
      attributes: { exclude: ["deletedAt"] },
      where: {
        userId: req.user.id,
      },
      distinct: true,
      include: [
        {
          model: Transaction,
          as: "transactions",
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

exports.getAccount = async (req, res) => {
  const id = req.params.id;
  try {
    const account = await UserAccount.findOne({
      attributes: { exclude: ["deletedAt"] },
      where: {
        userId: req.user.id,
        id,
      },
      distinct: true,
      include: [
        {
          model: Transaction,
          as: "transactions",
          attributes: { exclude: ["deletedAt"] },
        },
      ],
    });

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
        data : account
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
// Edit
// =================================================================================

exports.editAccount = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      accountType: Joi.string(),
      balance: Joi.number(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const check = await UserAccount.update(
      {
        ...body,
      },
      {
        where: {
          userId: req.user.id,
          id,
        },
      }
    );

    if (!check) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to update account, please try again",
      });
    }

    const account = await UserAccount.findOne({
      attributes: { exclude: ["deletedAt"] },
      where: {
        userId: req.user.id,
        id,
      },
      distinct: true,
      include: [
        {
          model: Transaction,
          as: "transactions",
          attributes: { exclude: ["deletedAt"] },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Account updated successfully",
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
// Edit
// =================================================================================

exports.deleteAccount = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const user = await UserAccount.destroy({
      where: {
        id,
        userId,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to delete the account",
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

exports.restoreAccount = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const account = await UserAccount.restore({
      where: {
        id,
        userId,
      },
    });
    if (!account) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to restore the account",
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
