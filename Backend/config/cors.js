const cors = require("cors");

module.exports = cors({
  origin: "http://localhost:5173",
  credentials: true,
});
