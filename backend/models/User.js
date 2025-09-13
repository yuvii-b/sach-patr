const pool = require("../config/db");

const registerUser = async (username, email, hashedPassword, role) => {
    const result = await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
    [username, email, hashedPassword, role]);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

const findUserByUsername = async (username) => {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
};

module.exports = { registerUser, findUserByEmail, findUserByUsername };