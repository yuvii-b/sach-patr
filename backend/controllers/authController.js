const {signupSchema, loginSchema} = require("../validator/authValidator");
const {register} = require("../service/authService");

const registerController = async (req, res) => {
    try{
        const {error} = signupSchema.validate(req.body);
        if(error) return res.status(400).json({error: error.details[0].message});

        const {username, email, password, role} = req.body;
        const user = await register(username, email, password, role);
    }
};