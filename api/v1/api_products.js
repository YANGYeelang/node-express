const express = require("express");
const router = express.Router();
const db = require("../../db");
const jwt = require("../../jwt");
const moment = require("moment");

router.post("/create/products", jwt.verify, (req, res) => {
  const proName = req.body.proName;
  const price = req.body.price;
  const proTypeId = req.body.proTypeId;
  const dateTime = moment().format("YYYY-MM-DD");

  const sql = "SELECT * FROM tbl_products WHERE proName = ?";
  db.query(sql, [proName], (err, result) => {
    if (result.length > 0) {
      res.send("exists");
    } else {
      const sql =
        "INSERT INTO tbl_products(proName, dateTime, categoryId, price) VALUES (?,?,?,?)";
      db.query(sql, [proName, dateTime, proTypeId, price], (error, row) => {
        if (error) throw error;
        res.json({ status: "inserted", message: "insert success" });
      });
    }
  });
});

router.put("/update/products", jwt.verify, (req, res) => {
  const proId = req.body.id;
  const proName = req.body.proName;
  const proTypeId = req.body.proTypeId;
  const price = req.body.price;
  const dateTime = moment().format("YYYY-MM-DD");

  const sql =
    "UPDATE tbl_products SET proName = ?, price = ?, dateTime = ?, categoryId = ? WHERE id = ?";
  db.query(sql, [proName, price, dateTime, proTypeId, proId], (err, result) => {
    if (err) throw err;
    res.send("updated");
  });
});

router.delete("/delete/products", jwt.verify, (req, res) => {
  const proId = req.body.proId;

  if (proId) {
    const sql = "DELETE FROM tbl_products WHERE id = ?";
    db.query(sql, [proId], (err, result) => {
      if (err) throw err;
      res.json({ status: "delete", message: "Deleted" });
    });
  } else {
    res.json({ status: "please choose data", message: "please required data" });
  }
  console.log(proId);
});

router.get("/get/products", jwt.verify, (req, res) => {
  const sql =
    "SELECT pro.`id`, `proName`, `price`, `dateTime`, `category_name`\n" +
    "\tFROM`tbl_products` as pro INNER\n" +
    "JOIN category as typePro ON pro.categoryId = typePro.id";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/count/products", jwt.verify, (req, res) => {
  const sql = "SELECT COUNT(id) FROM `tbl_products`";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
