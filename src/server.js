const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const http = require("http");
const app = require("./app");
const { sequelize } = require("./models");  

const PORT = process.env.PORT ;
let server;


async function startServer() {
  try {
    // 1. DB connect first
    await sequelize.authenticate();
    console.log("✅ Database connected");



    // 2. Server start
    server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} already in use`);
        process.exit(1);
      }
      console.error("❌ Server error:", err);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); 
  }
}


const shutdown = async (signal) => {
  console.log(`🛑 ${signal} received`);
  
  try {
    await sequelize.close();
    console.log("✅ DB closed");
  } catch (err) {
    console.error("❌ DB close error:", err.message);
  }

  server?.close(() => {
    console.log("✅ Server closed gracefully");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer();  
