const express = require("express");
const router = express.Router();
const pool = require("../db");


// GET all units
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM units");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch units" });
    }
});


// GET one unit
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM units WHERE id = $1",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch unit" });
    }
});


// create unit
router.post("/", async (req, res) => {
    try {
        const { name, location } = req.body;

        const result = await pool.query(
            `
            INSERT INTO units (name, location)
            VALUES ($1, $2)
            RETURNING *
            `,
            [name, location]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create unit" });
    }
});


// update unit
router.put("/:id", async (req, res) => {
    try {
        const { name, location } = req.body;

        const result = await pool.query(
            `
            UPDATE units
            SET
                name = $1,
                location = $2
            WHERE id = $3
            RETURNING *
            `,
            [name, location, req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update unit" });
    }
});



router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM units WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete unit" });
    }
});


module.exports = router;