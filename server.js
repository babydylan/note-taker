const fs = require("fs")
const express = require("express");
const path = require("path");
const routes = require("./routes/routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(
    express.static("public", {
      extensions: "html",
    })
);

routes(app);

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);