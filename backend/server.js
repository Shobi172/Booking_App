require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/booking", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" }); 
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
