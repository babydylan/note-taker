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
    req.body.id = genID()
    let newDataArray = [...req.noteData, req.body]
    fs.writeFile("./db/db.json", JSON.stringify(newDataArray), (err, data) => {
      if (!err) {
        next()
      } else console.log(err)
    })
}




app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);