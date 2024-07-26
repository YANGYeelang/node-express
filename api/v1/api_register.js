const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const db = require("../../db");
const multer = require("multer")
const pth =require("path");
const path = require("path");


router.post("/register", function (req, res) {
let myFileName = "";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploaded");
  },
  filename: function (req, file, cb) {
    myFileName = uuidv4() + path.extname(file.originalname); // image122.png
    cb(null, myFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10485760 },
}).single("myFile");

upload(req, res, function (err) {
  if (err instanceof multer.MulterError) {
    if (err.code == "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "File is larger then 10mb" });
    }
  } else if (err) {
    res.status(400).json({ message: "Upload file is error" });
  }

    const uuid = uuidv4();
    const name = req.sanitize(req.body.name);
    const last_name = req.sanitize(req.body.last_name);
    const address = req.sanitize(req.body.address);
    const tel = req.sanitize(req.body.tel);
    const email = req.sanitize(req.body.email);
    const password = bcrypt.hashSync(req.body.password, 8);
    const image = myFileName;
    const created_date = moment().format("YYYY-MM-DD H:m:s");

    if (last_name && email && password) {
      db.query(
        "SELECT * FROM tbl_customer WHERE email = ? ",
        [email],
        (err, rs) => {
          if (rs.length > 0) {
            res.send("Exist");
            console.log("Your account already used");
          } else {
            let sql =
              "INSERT INTO tbl_customer (uuid,name,last_name,address,tel,email,password, image,created_date) VALUES  ?";
            let data = [
              [
                uuid,
                name,
                last_name,
                address,
                tel,
                email,
                password,
                image,
                created_date,
              ],
            ];
            db.query(sql, [data], (err, rs) => {
              if (rs) {
                res.send("Inserted");
              } else {
                res.send(err);
                res.send("Error");
              }
            });
          }
        }
      );
    } else {
      res.send("data is required");
    }
});
});

module.exports = router;
