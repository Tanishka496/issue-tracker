const express = require("express");
const dbModule = require("./config/db");
const connectDB = dbModule.default || dbModule;
const authRoutes= require("./routes/authRoutes")
const projectRoutes = require("./routes/projectRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/", (req, res) => res.send("Welcome to issue tracker"));

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB(); // wait for DB before listening
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

