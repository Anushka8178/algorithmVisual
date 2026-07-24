import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const useSqlite = process.env.USE_SQLITE === "true" || process.env.DB_DIALECT === "sqlite";
const dbName = process.env.DB_NAME || "algodb";
const dbUser = process.env.DB_USER || "postgres";
const dbPass = process.env.DB_PASS || "postgres";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5433;

const createSequelizeInstance = () => {
  if (databaseUrl) {
    console.log("📡 Connecting to PostgreSQL via DATABASE_URL...");
    return new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
        connectTimeout: 10000,
      },
      retry: { max: 3 },
    });
  }

  if (useSqlite) {
    console.log("📦 Using SQLite file database (algodb.sqlite)...");
    return new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "..", "algodb.sqlite"),
      logging: false,
    });
  }

  console.log(`🔌 Connecting to PostgreSQL at ${dbHost}:${dbPort}...`);
  return new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      connectTimeout: 5000,
    },
    retry: { max: 1 },
  });
};

let sequelize = createSequelizeInstance();

try {
  await sequelize.authenticate();
  console.log("✅ Database connection authenticated");
} catch (err) {
  console.warn("⚠️ Primary database connection failed:", err.message);
  console.log("🔄 Automatically switching to embedded SQLite database...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "algodb.sqlite"),
    logging: false,
  });
  await sequelize.authenticate();
  console.log("✅ Fallback SQLite database connected successfully!");
}

export default sequelize;
