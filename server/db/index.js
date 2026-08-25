const { Pool } = require("pg");


/* Creates a connection pool between your Express server and PostgreSQL
Pool manages multiple database connections for your server 
so you don't have to open and close a new connection for every request */

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "lmtv_maintenance",
});

module.exports = pool;