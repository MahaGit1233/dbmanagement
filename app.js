const express = require("express");
const app = express();
const db = require("./utils/db-connection");
const cors = require("cors");
const tableRouter = require("./routes/tableRouter");
const recordRouter = require("./routes/recordRouter");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Hello World!</h1>`);
});

app.use("/tables", tableRouter);
app.use("/records", recordRouter);

db.sync({ force: true })
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is Running on http://localhost:4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
