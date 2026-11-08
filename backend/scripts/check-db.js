require("dotenv").config();

const { Pool } = require("pg");

async function testDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing from backend/.env");
  }

  const pool = new Pool({ connectionString });

  try {
    const result = await pool.query(
      "SELECT current_database() AS database, NOW() AS connected_at"
    );

    console.log("Database connected successfully!");
    console.log(result.rows);
  } finally {
    await pool.end();
  }
}

testDatabase().catch((error) => {
  console.error("Database connection failed:", error.message);
  process.exitCode = 1;
});