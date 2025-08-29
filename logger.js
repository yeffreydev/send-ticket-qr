// logger.js
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "logs.txt");

function logToFile(message) {

    //convert message to string
    if (typeof message === "object") {
      message = JSON.stringify(message);
    } else {
      message = message.toString();
    }
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("❌ Error escribiendo en logs.txt:", err);
    }
  });
}

module.exports = { logToFile };
