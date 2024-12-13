const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const diaryRoutes = require("./routes/diary.js");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const swaggerDocument = require("../swagger.json");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors());

// Limit requests from same API (bruteforce and denial of service attacks protection)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

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
