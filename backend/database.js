const mysql = require("mysql2");
const dotenv = require("dotenv");
// import dotenv from "dotenv";
dotenv.config();

const sql = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

async function initializeDatabase(id) {
  const [rows] = await sql.query("SELECT * FROM users where id = ?", [id]);
  return rows;
}

(async () => {
  try {
    const data = await initializeDatabase(3);
    console.log("SQL connected, data:", data);
  } catch (error) {
    console.error("Error connecting to SQL:", error);
  }
})();

module.exports = sql;
