const fs = require("fs")
const express = require("express");
const path = require("path");
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(
    express.static("public", {
      extensions: "html",
    })
);

//routes
function writeDataToDB(req, res, next) {
    req.body.id = genID();
    let newData = [...req.noteData, req.body];
    fs.writeFile("./db/db.json", JSON.stringify(newData), (err, data) => {
      if (!err) {
        next();
      } else console.log(err);
    });
}

function getData(req, res, next) {
    fs.readFile("./db/db.json", (err, data) => {
      req.noteData = JSON.parse(data);
      next();
      if (err) {
        res.sendStatus(500);
      }
    });
}

function deleteData(req, res, next) {
    req.noteData = req.noteData.filter((note) => note.id !== req.params.id)
    next()
}

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);