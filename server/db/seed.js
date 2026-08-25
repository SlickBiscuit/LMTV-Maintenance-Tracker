const { faker } = require("@faker-js/faker");
const pool = require("./index");

const seedUnits = async () => {
    try {
        for (let i = 0; i < 3; i++) {
            const name = `${faker.word.adjective()} Company`;
            const location = faker.location.city();

            await pool.query(
                `
        INSERT INTO units (name, location)
        VALUES ($1, $2)
        `,
                [name, location]
            );
        }

        console.log("Units seeded successfully");
    } catch (error) {
        console.error(error);
    }
};

const seedLmtvs = async () => {
    try {
        const { rows: units } = await pool.query("SELECT id FROM units");

        for (let i = 1; i <= 10; i++) {
            const unit = faker.helpers.arrayElement(units);

            await pool.query(
                `
        INSERT INTO lmtvs
          (unit_id, plate_number, serial_number, mileage, status)
        VALUES
          ($1, $2, $3, $4, $5)
        `,
                [
                    unit.id,
                    `LMTV-${String(i).padStart(2, "0")}`,
                    faker.string.alphanumeric(10).toUpperCase(),
                    faker.number.int({ min: 5000, max: 100000 }),
                    faker.helpers.arrayElement([
                        "Operational",
                        "Maintenance",
                        "Deadlined"
                    ])
                ]
            );
        }

        console.log("LMTVs seeded successfully");
    } catch (error) {
        console.error(error);
    }
};

const seedMechanics = async () => {
    try {
        for (let i = 0; i < 10; i++) {
            const rank = faker.helpers.arrayElement([
                "PVT",
                "PFC",
                "SPC",
                "CPL",
                "SGT",
                "SSG",
                "SFC",
                "MSG",
                "1SG",
                "SGM"
            ]);

            const lastName = faker.person.lastName();
            const firstName = faker.person.firstName();

            await pool.query(
                `
        INSERT INTO mechanics
          (rank, last_name, first_name)
        VALUES
          ($1, $2, $3)
        `,
                [rank, lastName, firstName]
            );
        }

        console.log("Mechanics seeded successfully");
    } catch (error) {
        console.error(error);
    }
};

const seedMaintenanceRecords = async () => {
    try {
        const { rows: lmtvs } = await pool.query(
            "SELECT id, mileage FROM lmtvs"
        );

        for (let i = 0; i < 20; i++) {
            const lmtv = faker.helpers.arrayElement(lmtvs);

            await pool.query(
                `
                INSERT INTO maintenance_records
                    (lmtv_id, maintenance_type, description, mileage, date_completed, status)
                VALUES
                    ($1, $2, $3, $4, $5, $6)
                `,
                [
                    lmtv.id,
                    faker.helpers.arrayElement([
                        "Oil Change",
                        "Brake Service",
                        "Tire Replacement",
                        "PMCS",
                        "Engine Service"
                    ]),
                    faker.lorem.sentence(),
                    lmtv.mileage,
                    faker.date.recent({ days: 90 }),
                    faker.helpers.arrayElement([
                        "Completed",
                        "Pending"
                    ])
                ]
            );
        }

        console.log("Maintenance records seeded successfully");
    } catch (error) {
        console.error(error);
    }
};

const seedLmtvMechanics = async () => {
    try {
        const { rows: lmtvs } = await pool.query(
            "SELECT id FROM lmtvs"
        );

        const { rows: mechanics } = await pool.query(
            "SELECT id FROM mechanics"
        );

        for (const lmtv of lmtvs) {
            const assignedMechanics = faker.helpers.arrayElements(
                mechanics,
                { min: 2, max: 4 }
            );

            for (const mechanic of assignedMechanics) {
                await pool.query(
                    `
                    INSERT INTO lmtv_mechanics
                        (lmtv_id, mechanic_id)
                    VALUES
                        ($1, $2)
                    `,
                    [lmtv.id, mechanic.id]
                );
            }
        }

        console.log("LMTV mechanics seeded successfully");
    } catch (error) {
        console.error(error);
    }
};

const seed = async () => {
    await seedUnits();
    await seedLmtvs();
    await seedMechanics();
    await seedMaintenanceRecords();
    await seedLmtvMechanics();
    await pool.end();
};

seed();