const sequelize = require("../utils/db-connection");

const addRecord = async (req, res) => {
  try {
    const { table } = req.params;
    const [results] = await sequelize.query(`SELECT * FROM "${table}"`);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { table, id } = req.params;
    await sequelize.query(`DELETE FROM "${table}" WHERE id = ${id}`);
    res.status(200).send("Record deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
};

module.exports = {
  addRecord,
  deleteRecord,
};
