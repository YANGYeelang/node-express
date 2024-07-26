const mysql = require("mysql")
var connection = mysql.createPool({
    connectionLimit: 100000,
    host: "localhost",
    user: "root",
    passworld: "",
    database: "react_node_db"
})

module.exports = connection;