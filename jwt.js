const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { verify } = require("crypto");

const privateKey = fs.readFileSync(
  path.join(__dirname + "/./key/private.key"),
  "utf-8"
);
const publicKey = fs.readFileSync(
  path.join(__dirname + "/./key/public.key"),
  "utf-8"
);

module.exports = {
  sign: (payload) => {
    var signOption = {
      expiresIn: "24h",
      algorithm: "RS256",
    };
    return jwt.sign(payload, privateKey, signOption);
  },
  verify: (req, res, next) => {
    var token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).send({
        auth: false,
        message: "Your Token is provided!",
      });
    }

    var verifyOptions = {
      expiresIn: "24h",
      algorithm: "RS256",
    };

    jwt.verify(token, publicKey, verifyOptions, (err, decoded) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res.status(419).send({
            auth: false,
            message: "Your Token is expired!!",
          });
        }
        return res.status(401).send({
          auth: false,
          message: "Failed to authentication. Please try again later!!",
        });
      }

      next();
    });
  },
};
