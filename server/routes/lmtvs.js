const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM lmtvs ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch LMTVs" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM lmtvs WHERE id = $1",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "LMTV not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch LMTV" });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            unit_id,
            plate_number,
            serial_number,
            mileage,
            status
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO lmtvs
                (unit_id, plate_number, serial_number, mileage, status)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                unit_id,
                plate_number,
                serial_number,
                mileage,
                status
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create LMTV" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const {
            unit_id,
            plate_number,
            serial_number,
            mileage,
            status
        } = req.body;

        const result = await pool.query(
            `
            UPDATE lmtvs
            SET
                unit_id = $1,
                plate_number = $2,
                serial_number = $3,
                mileage = $4,
                status = $5
            WHERE id = $6
            RETURNING *
            `,
            [
                unit_id,
                plate_number,
                serial_number,
                mileage,
                status,
                req.params.id
            ]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update LMTV" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM lmtvs WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete LMTV" });
    }
});

//Get all mechanics assigned to a specific LMTV

router.get("/:lmtvId/mechanics", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                mechanics.id,
                mechanics.rank,
                mechanics.last_name,
                mechanics.first_name
            FROM lmtv_mechanics
            JOIN mechanics
                ON lmtv_mechanics.mechanic_id = mechanics.id
            WHERE lmtv_mechanics.lmtv_id = $1
            `,
            [req.params.lmtvId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch LMTV mechanics"
        });
    }
});


//Get all maintenance records belonging to LMTV

router.get("/:lmtvId/maintenance", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM maintenance_records
            WHERE lmtv_id = $1
            `,
            [req.params.lmtvId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch LMTV maintenance records"
        });
    }
});

module.exports = router;