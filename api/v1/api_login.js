const express = require("express");
const router = express.Router();
const db = require("../../db");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("./../../jwt")

//err: error
//rs: result
router.post("/login", function (req, res) {
  const email = req.sanitize(req.body.email);
  const password = req.sanitize(req.body.password);

  if (email && password) {
    db.query(
      "SELECT * FROM tbl_customer WHERE email = ?",
      [email],
      (err, rs) => {
        if (err) throw err;
        if (rs.length > 0) {
          let Logged = bcrypt.compareSync(password, rs[0].password);
          if (Logged) {
            var payload = {
              uuid: rs[0].uuid,
              email: email,
              create_date: moment().format("YYYY-MM-DD H:m:s"),
            };
            const token = jwt.sign(payload);
            res.json({ status: "success", message: "Logged", token: token, email:email});
          } else {
            res.json({ status: "error", message: "Password Incorrect" });
          }
        } else {
          res.json({ status: "error", message: "Login Failed" });
        }
      }
    );
  }
});

module.exports = router;
