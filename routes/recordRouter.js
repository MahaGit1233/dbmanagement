const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");

router.post("/add-record/:table", recordController.addRecord);
router.get("/get-records/:table", recordController.getRecords);
router.delete("/delete-record/:table/:id", recordController.deleteRecord);

module.exports = router;
