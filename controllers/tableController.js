const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const addTable = async (req, res) => {
  try {
    const { tableName, fields } = req.body;
    const schema = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    };

    fields.forEach((field) => {
      schema[field.name] = { type: DataTypes[field.type.toUpperCase()] };
    });

    sequelize.define(tableName, schema, {
      freezeTableName: true,
      timestamps: true,
    });
    await sequelize.sync();
    res.status(201).send("Table created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating table");
  }
};

const getAllTables = async (req, res) => {
  try {
    const [results] = await sequelize.query("SHOW TABLES");
    console.log("table respose:", results);
    const tables = results.map((row) => Object.values(row)[0]);
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tables");
  }
};

const getFields = async (req, res) => {
  const { table } = req.params;
  try {
    const [results] = await sequelize.query(`DESCRIBE \`${table}\``);
    const fields = results.map((row) => row.Field).filter((f) => f !== "id");
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching fields");
  }
};

const deleteTable = async (req, res) => {
  try {
    const { table } = req.params;
    await sequelize.getQueryInterface().dropTable(table);
    res.send("Table deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting table");
  }
};

module.exports = {
  addTable,
  getAllTables,
  getFields,
  deleteTable,
};
