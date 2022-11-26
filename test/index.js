const express = require("express");
const parser = require("../cpp_parser/build/Release/parser");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const port = 3000;

app.use(
  bodyparser.json({
    limit: "50mb",
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/caff", (req, res) => {
  console.log(typeof req.body.data);
  parser.parse(Buffer.from(req.body.data, "base64"));
  //parser.parse(req.body.data);
  
  res.status(201).json({
    message: "kabbe",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
