const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM maintenance_records"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch maintenance records"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM maintenance_records WHERE id = $1",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch maintenance record"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            lmtv_id,
            mechanic_id,
            description,
            status
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO maintenance_records
                (lmtv_id, mechanic_id, description, status)
            VALUES
                ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                lmtv_id,
                mechanic_id,
                description,
                status
            ]
        );

        res.status(201).json(result.rows[0]); //return first item in the array
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create maintenance record"
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const {
            lmtv_id,
            mechanic_id,
            description,
            status
        } = req.body;

        const result = await pool.query(
            `
            UPDATE maintenance_records
            SET
                lmtv_id = $1,
                mechanic_id = $2,
                description = $3,
                status = $4
            WHERE id = $5
            RETURNING *
            `,
            [
                lmtv_id,
                mechanic_id,
                description,
                status,
                req.params.id
            ]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update maintenance record"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM maintenance_records WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete maintenance record"
        });
    }
});

module.exports = router;

