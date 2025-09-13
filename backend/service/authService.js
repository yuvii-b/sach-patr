const {registerUser, findUserByEmail, findUserByUsername} = require("../models/User");
const {customError} = require("../utilities/customError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (username, email, password, role) => {
    const existingMail = await findUserByEmail(email);
    if(existingMail) throw new customError("Email already exists", 400);
    const existingUser = await findUserByUsername(username);
    if (existingUser) throw new customError("Username already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await registerUser(username, email, hashedPassword, role);

    return user;
};