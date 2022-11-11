require("dotenv").config();

const dbConfig = { url: process.env.MONGO_URI };

module.exports = dbConfig;
