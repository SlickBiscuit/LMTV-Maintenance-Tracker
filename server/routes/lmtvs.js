const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM lmtvs");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch LMTVs" });
    }
});

module.exports = router;