const { User } = require("../../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// =================================================================================
// Get
// =================================================================================

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: { exclude: ["password", "deletedAt"] },
    });

    return res.json({
      status: "success",
      message: "Profile retrieved successfully",
      data: user,
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
// Delete
// =================================================================================

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.destroy({
      where: {
        id: req.user.id,
      },
    });
    if (!user) {
      res.status(400).json({
        status: "failed",
        message: "Failed to delete the user",
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
// Edit
// =================================================================================

exports.editUser = async (req, res) => {
  const body = req.body;
  try {
    const schema = Joi.object({
      username: Joi.string(),
      name: Joi.string(),
      password: Joi.string(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const check = await User.update(
      {
        ...body,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    if (!check) {
      return res.json({
        status: "failed",
        message: "Failed to update profile",
      });
    }
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: { exclude: ["password", "deletedAt"] },
    });
    return res.json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
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

exports.restoreUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.restore({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Failed to restore the user",
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
