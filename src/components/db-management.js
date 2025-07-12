// CreateDynamicTables.jsx
import React, { useState, useEffect } from "react";

const DbManagement = () => {
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState([{ name: "", type: "" }]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [records, setRecords] = useState([]);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/tables/get-tables")
      .then((res) => res.json())
      .then((data) => {
        console.log("Tables fetched from backend", data);
        setTables(data);
      });
  }, []);

  const addField = () => {
    setFields([...fields, { name: "", type: "" }]);
  };

  const handleFieldChange = (index, e) => {
    const updated = [...fields];
    updated[index][e.target.name] = e.target.value;
    setFields(updated);
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/tables/create-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableName, fields }),
    });
    const result = await response.text();
    alert(result);
    setTables((prev) => [...prev, tableName]);
    setTableName("");
    setFields([{ name: "", type: "" }]);
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setFieldsLoaded(false);
    setFieldValues({});
    setRecords([]);

    fetch(`http://localhost:4000/tables/get-fields/${table}`)
      .then((res) => res.json())
      .then((fields) => {
        const emptyValues = fields.reduce(
          (acc, field) => ({ ...acc, [field]: "" }),
          {}
        );
        setFieldValues(emptyValues);
        setFieldsLoaded(true);
      });

    fetch(`http://localhost:4000/records/get-records/${table}`)
      .then((res) => res.json())
      .then((data) => setRecords(data));
  };

  const handleRecordChange = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/records/add-record/${selectedTable}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fieldValues),
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        return fetch(
          `http://localhost:4000/records/get-records/${selectedTable}`
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);

        const resetValues = Object.keys(fieldValues).reduce((acc, field) => {
          acc[field] = "";
          return acc;
        }, {});
        setFieldValues(resetValues);
      });
  };

  const handleDeleteTable = async (table) => {
    const confirm = window.confirm(
      `Are you sure you want to delete table "${table}"?`
    );
    if (!confirm) return;

    await fetch(`http://localhost:4000/tables/delete-table/${table}`, {
      method: "DELETE",
    });

    setTables(tables.filter((t) => t !== table));
    if (selectedTable === table) {
      setSelectedTable(null);
      setFieldValues({});
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Table</h2>
      <form onSubmit={handleCreateTable}>
        <label htmlFor="tableName">Table Name: </label>
        <input
          id="tableName"
          type="text"
          placeholder="Table Name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          required
        />
        <h4>Fields:</h4>
        {fields.map((field, index) => (
          <div key={index}>
            <label htmlFor="fieldName">Field Name: </label>
            <input
              id="fieldName"
              type="text"
              name="name"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => handleFieldChange(index, e)}
              required
            />
            <br />
            <label htmlFor="tableType">Type: </label>
            <select
              id="tableType"
              name="type"
              value={field.type}
              onChange={(e) => handleFieldChange(index, e)}
              required
            >
              <option value="">Select Type</option>
              <option value="STRING">STRING</option>
              <option value="INTEGER">INTEGER</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="DATE">DATE</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addField}>
          Add Field
        </button>
        <br />
        <br />
        <button type="submit">Create Table</button>
      </form>

      <hr />

      <h2>Tables</h2>
      <ul>
        {[...new Set(tables.filter((t) => t))].map((table) => (
          <li key={table}>
            <span
              onClick={() => handleSelectTable(table)}
              style={{ cursor: "pointer" }}
            >
              {table}
            </span>
            <button onClick={() => handleDeleteTable(table)}>🗑</button>
          </li>
        ))}
      </ul>

      {selectedTable && (
        <div>
          <h3>Add Record to {selectedTable}</h3>
          <form onSubmit={handleAddRecord}>
            {Object.entries(fieldValues).map(([key, val]) => (
              <div key={key}>
                <label>{key}:</label>
                <input
                  name={key}
                  value={val}
                  onChange={handleRecordChange}
                  required
                />
              </div>
            ))}
            <button type="submit">Submit Record</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DbManagement;
