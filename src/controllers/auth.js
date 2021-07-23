const { User } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =================================================================================
// REGISTER
// =================================================================================

exports.register = async (req, res) => {
  const body = req.body;
  const { name, username, password } = body;
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const checkUsername = await User.findOne({
      where: {
        username,
      },
    });

    if (checkUsername) {
      return res.status(400).json({
        status: "failed",
        message: "Username already exist, please use another username.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...body,
      password: hashedPassword,
      lastLogin: new Date(),
    });

    const payload = {
      id: user.id,
      username: user.username,
    };

    jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        status: "success",
        message: "Registered in successfully",
        data: {
          token,
        },
      });
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
// REGISTER
// =================================================================================

exports.login = async (req, res) => {
  const body = req.body;
  const { username, password } = body;

  try {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ ...body }, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong username or password",
      });
    }

    const validate = await bcrypt.compare(password, user.password);

    if (!validate) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong email or password",
      });
    }

    User.update(
      {
        lastLogin: new Date(),
      },
      {
        where: {
          username,
        },
      }
    );

    const payload = {
      id: user.id,
      username: user.username,
    };

    jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        data: {
          token,
        },
      });
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
