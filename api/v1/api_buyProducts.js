const express = require("express");
const router = express.Router();
const db = require("../../db");
const jwt = require("../../jwt");
const moment = require("moment");

//insert buy data

router.post("/create/buy/products", jwt.verify, (req, res) => {
  const proId = req.sanitize(req.body.productsId);
  const arrayProId = req.body.productsId;
  const price = req.body.price;
  const amount = req.body.amount;
  const user = req.body.user;
  const dateTime = moment().format("YYYY-MM-DD");
  const status = req.body.status;

  console.log("status", status);

  if (status == 1) {
    console.log("one I");
    let sql = "INSERT INTO tbl_buy(proId, price, amount, userId, dateTime ) values(?,?,?,?,?)";
    db.query(sql, [proId, price, amount, user, dateTime], (err, rs) => {
      if (err) throw err;
      res.send(rs);
    });
  } else {
    console.log("Two II");
    for (let i = 0; i < arrayProId.length; i++) {
      let sql = "INSERT INTO tbl_buy(proId, price, amount, userId, dateTime ) values(?,?,?,?,?)";
      db.query(
        sql,
        [`${arrayProId[i]}`, `${price[i]}`, `${amount[i]}`, user, dateTime],
        (err, rs) => {
          if (err) throw err;
          // res.send(rs);
          console.log(rs);
        }
      );
    }
  }
});

//get buy data

router.get("/fetch/buy/data", jwt.verify, (req, res) => {
  const sql =
    "SELECT tbl_buy.id,proName,tbl_buy.price,amount,userId FROM tbl_buy \n" +
    "\t INNER JOIN tbl_products pr ON tbl_buy.proId = pr.id";
  db.query(sql, (err, rs) => {
    if (err) throw err;
    res.send(rs);
  });
});

router.delete("/delete/buy/data", jwt.verify, (req, res) => {
  const id = req.body.id
  db.query("DELETE FROM `tbl_buy` WHERE id = ?", [id], (err, rs) => {
    if(err) throw err
    res.json({status:"delete", message:"delete buy data"})
  })
})

module.exports = router;
