const path = require("path");
const jwt = require("jsonwebtoken");
const userModel = require(path.join(__dirname, "../models/userModel"));

require("dotenv").config();

const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        res.status(403).send({ message: "Invalid JWT passed." });
      } else {
        userModel
          .findById(decoded.id)
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    });
  } else {
    res.status(403).send({ message: "Invlid JWT Passed" });
    next();
  }
};

module.exports = verifyToken;
