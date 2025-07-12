const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

router.post("/create-table", tableController.addTable);
router.get("/get-tables", tableController.getAllTables);
router.get("/get-fields/:table", tableController.getFields);
router.delete("/delete-table/:table", tableController.deleteTable);

module.exports = router;
