const sequelize = require("../utils/db-connection");

const addRecord = async (req, res) => {
  try {
    const { table } = req.params;
    const data = req.body;

    const keys = Object.keys(data)
      .map((key) => `\`${key}\``)
      .join(", ");
    const values = Object.values(data)
      .map((val) => `'${val}'`)
      .join(", ");

    const query = `INSERT INTO \`${table}\` (${keys}) VALUES (${values})`;
    console.log("Executing query", query);
    console.log("data", data);

    await sequelize.query(query);

    res.status(200).send("Record inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const getRecords = async (req, res) => {
  try {
    const { table } = req.params;
    const [results] = await sequelize.query(`SELECT * FROM \`${table}\``);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { table, id } = req.params;
    await sequelize.query(`DELETE FROM \`${table}\` WHERE id = ${id}`);
    res.status(200).send("Record deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
};

module.exports = {
  addRecord,
  getRecords,
  deleteRecord,
};
