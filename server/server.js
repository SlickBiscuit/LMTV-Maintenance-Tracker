const express = require("express");
const cors = require("cors");
const pool = require("./db")

const app = express();
const port = 3000

const lmtvRouter = require("./routes/lmtvs");
const unitsRouter = require("./routes/units");
const mechanicsRouter = require("./routes/mechanics");
const maintenanceRouter = require("./routes/maintenance");

app.use(cors());
app.use(express.json());

app.use("/api/lmtvs", lmtvRouter);
app.use("/api/units", unitsRouter);
app.use("/api/mechanics", mechanicsRouter);
app.use("/api/maintenance", maintenanceRouter);

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.get("/", (req, res) => {
    res.json("LMTV Maintenance API is running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

