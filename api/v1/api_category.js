const express = require("express");
const router = express.Router();
const db = require("../../db");
const jwt = require("../../jwt");

router.post("/category", jwt.verify, (req, res) => {
  const category = req.body.proType;
  console.log(category);

  db.query(
    "select * from category where category_name = ?",
    [category],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.send("exits");
      } else {
        let data = [[category]];
        let sql = "INSERT INTO `category`(`category_name`) VALUES ?";
        db.query(sql, [data], (err, result) => {
          if (err) throw err;
          res.send("inserted");
        });
      }
    }
  );
});



router.get("/category/data", jwt.verify, (err, res) => {
  db.query("SELECT * FROM category", (err, rs) => {
    if(rs) {
      res.send(rs)
    }
  })
})

//Update category

router.put("/update/category", jwt.verify, (req, res) =>{

const categoryId = req.body.id;
const categoryName = req.body.name

let sql  = "UPDATE category SET ? WHERE id = ?"
let updateData = {"category_name": categoryName}

db.query(sql, [updateData, categoryId], (err, result) =>{
  if(err) throw err
  res.json({status:"Update success", message:"update"})
})
})


router.delete("/category_remove", jwt.verify, (req, res) => {
  const category_id = req.body.id;
  const sql ="DELETE FROM category WHERE id = ?";
  if(category_id){
    db.query(sql, [category_id], (err, result) => {
      if (err) throw err;
      if(result) {
        res.json({status: "delete", message:"deleted"})
      }
    })
  }
})
module.exports = router;
