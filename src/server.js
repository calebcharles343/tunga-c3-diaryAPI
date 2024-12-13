const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const diaryRoutes = require("./routes/diary.js");
const swaggerDocument = require("../swagger.json");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Swagger Documentation
app.use(
  "/cohort3-fullstack/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Routes
app.use("/api/cohort3-fullstack/auth", authRoutes);
app.use("/api/cohort3-fullstack/diary", diaryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
