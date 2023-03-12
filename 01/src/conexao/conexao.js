const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Kitanda8841",
    database: "catalago_pokemons"
});

module.exports = pool