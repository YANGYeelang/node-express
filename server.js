const express = require("express");
const app = express();
const cors = require("cors");
const expressSanitizer = require("express-sanitizer");

var corsOptions = {
  origin: "*",
  // ["https://paokue77.com","https://dv-paokue.netlify.app/"]
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ limit: "3mb", extended: true}));

app.use(expressSanitizer());
// app.use(express.json());

app.use(function(err, req, res, next) {
  if(err.type == 'entity.too.large'){
    res.status(431).json({message: "Size limit 1kb"})
    return;
  }
})

// req = request
// res = response
app.get("/", function (req, res) {
  res.send("Hello Yeelang");
});

app.use("/api/v1", require("./api/v1/api"));

const server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("You are runing at", host, port);
  console.log("You can exactly run yor project");
});
