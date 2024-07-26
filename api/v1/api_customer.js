const express = require("express");
const router = express.Router();
const db = require("../../db");
const jwt = require("../../jwt")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

router.get("/customer/list", jwt.verify, function (req, res) {
  let sql =
    "SELECT `id`, `uuid`, `name`, `last_name`, `address`, `tel`, `email`,`image`, `created_date` FROM `tbl_customer` ORDER BY created_date DESC";
  db.query(sql, function (err, rs) {
    if (err) throw err;

    res.json(rs);
  });
});

router.post("/customer/update", function (req, res) {
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


    const uuid = req.sanitize(req.body.uuid);
    const name = req.sanitize(req.body.name);
    const last_name = req.sanitize(req.body.last_name);
    const address = req.sanitize(req.body.address);
    const tel = req.sanitize(req.body.tel);
    const email = req.sanitize(req.body.email);
    const image = myFileName;

    let sql = "UPDATE `tbl_customer` SET ? WHERE uuid =? ";
    let values = {
      name: name,
      last_name: last_name,
      address: address,
      tel: tel,
      email: email,
    };

    let uploadImage = {
      image: image,
    };

    if (myFileName != "") {
      values = { ...values, ...uploadImage };
    }

    db.query(sql, [values, uuid], function (err, rs) {
      if (err) throw err;

      res.json({ status: "success", message: "UPDATE_SUCCESS" });
    });
  });
});

router.post('/customer/delete', function(req, res){
  const uuid = req.sanitize(req.body.uuid);

  let sql = "DELETE FROM `tbl_customer` WHERE uuid = ?"
  db.query(sql, [uuid], function(err, rs) {
if (err) throw err

res.json({status:"success", message:"Deleted"})
  })
})

module.exports = router;
