const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM mechanics");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch mechanics" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM mechanics WHERE id = $1",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch mechanic" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { rank, last_name, first_name } = req.body;

        const result = await pool.query(
            `
            INSERT INTO mechanics (rank, last_name, first_name)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [rank, last_name, first_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create mechanic" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { rank, last_name, first_name } = req.body;

        const result = await pool.query(
            `
            UPDATE mechanics
            SET
                rank = $1,
                last_name = $2,
                first_name = $3
            WHERE id = $4
            RETURNING *
            `,
            [rank, last_name, first_name, req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update mechanic" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM mechanics WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete mechanic" });
    }
});


module.exports = router;