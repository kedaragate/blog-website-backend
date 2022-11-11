const path = require("path");

const userModel = require(path.join(__dirname, "../models/userModel"));
const blogModel = require(path.join(__dirname, "../models/blogModel"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

require("dotenv").config();

exports.register = (req, res) => {
  const { firstName, lastName, emailId, role, password } = req.body;

  userModel
    .findOne({ emailId })

    .then((data) => {
      if (!data) {
        const newUser = new userModel({
          _id: new mongoose.Types.ObjectId(),
          firstName,
          lastName,
          emailId,
          role,
          password: bcrypt.hashSync(password.toString(), 10),
        });

        newUser

          .save()
          .then((data) => {
            res.status(200).send({
              message: `Registration successful with ${data.emailId}`,
            });
          })
          .catch((err) => res.status(500).send({ message: err.message }));
      } else {
        res.status(400).send({
          message: `User already registered with ${emailId}, Please login.`,
        });
      }
    });
};

exports.login = (req, res) => {
  const { emailId, password } = req.body;

  userModel
    .findOne({ emailId })
    .populate("blogs")
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `no user found with ${emailId}` });
        return;
      }
      let isPasswordValid = bcrypt.compareSync(password, data.password);

      if (!isPasswordValid) {
        res
          .status(401)
          .send({ isLoginSuccessFul: false, message: "Incorrect password" });
      } else {
        const token = jwt.sign(data.id, process.env.SECRET_KEY);

        res.json({
          isLoginSuccessFul: true,

          user: {
            id: data.id,
            email: data.emailId,
            firstName: data.firstName,
            lastName: data.lastName,
          },
          accessToken: token,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
