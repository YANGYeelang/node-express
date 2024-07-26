const express = require("express");
const router = express.Router();
const db = require("../../db");
const jwt = require("../../jwt");
const moment = require("moment");

router.post("/sale/products", jwt.verify, (req, res) => {
  const productId = req.body.productsId;
  const arrayPro = req.sanitize(req.body.productsId);
  const user = req.body.user;
  const products = req.body.products;
  const amount = req.body.amount;
  const price = req.body.price;
  const status = req.body.status;
  const dateTime = moment().format("YYYY-MM-DD");
  console.log("productId", user);

  if (status === "1") {
    const sql =
      "INSERT INTO tbl_saleproducts (amount,products,price,proId,user,dateTime) VALUES(?,?,?,?,?,?)";
    db.query(sql, [amount, products, price, productId, user, dateTime], (err, rs) => {
      if (err) throw err;
      res.send(rs);
    });
  } else {
    for (let i = 0; i < productId.length; i++) {
      const sql =
        "INSERT INTO tbl_saleproducts (amount,products,price,proId,user,dateTime) VALUES(?,?,?,?,?,?)";
      db.query(
        sql,
        [`${amount[i]}`, `${products[i]}`,`${price[i]}`, `${productId[i]}`, user, dateTime],
        (err, rs) => {
          if (err) throw err;
          // res.json((status:2000, message:"success"))
          console.log("inserted");
        }
      );
    }
  }
});

router.get("/get/sale", jwt.verify, (req, res) => {
  db.query("SELECT * FROM tbl_saleproducts", (err, rs) => {
    if (err) throw err;
    res.send(rs);
  });
});

module.exports = router;
