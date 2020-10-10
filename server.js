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
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

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
        res.sendStatus(404);
      }
    });
}

function deleteData(req, res, next) {
    req.noteData = req.noteData.filter((note) => note.id !== req.params.id);
    next();
};

module.exports = (app) => {
    app.get("/api/notes", getData, (req, res) => {
      res.send(req.noteData);
    });
  
    app.post("/api/notes", getData, writeDataToDB, (req, res) => {
      res.send(req.body);
    });
  
    app.delete("/api/notes/:id", getData, deleteData, (req, res) => {
      fs.writeFile("./db/db.json", JSON.stringify(req.noteData), (err) => {
        if (!err) res.send(req.body);
        else res.sendStatus(500)
      });
    });
};

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);