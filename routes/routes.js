const fs = require("fs");

function writeDataToDB(req, res, next) {
    let giveId = req.body.id;
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
