const express = require("express");
const cors = require("cors");
const pool = require("./db")

const app = express();
const port = 3000

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

/*app.get("/", (req, res) => {
    res.json("LMTV Maintenance API is running");
}); */

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

