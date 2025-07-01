const express = require('express');
const User = require('../models/User'); // assuming Mongoose model
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy';

//Route 1: create a user using: Post ./api/auth/createuser. No login required
router.post('/createuser',[

    body('name','Enter a valid name').isLength({min : 3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min : 5})

], async (req, res) => {
    // If there are errors, return bad requests and errors
    try {
    let success = false;

        const errors = validationResult (req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors : errors.array()});
        }
        // check whether the user user email exist alreSady
        let user = await User.findOne({email : req.body.email});
        console.log(user);
        if(user){
            return res.status(400).json({success, error: "sorry user with this email already exist"});
        }
        // create a user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
       
        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : secPass
        })

        const data = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken});
      
        
    // catch the error
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Failed to create user' });
    }
       

});

//Route 2:  authenticate a user using: Post ./api/auth/login. No login required
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must not be blank').exists()
], async (req, res) => {

    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // ✅ Use object destructuring, not array destructuring

    try {
        let user = await User.findOne({ email }); // ✅ Await and use correct model
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password); // ✅ Await this
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({success, error: "Invalid email or password" });
        }

        const data = {
            user: {
                id: user.id
            }
        };
        success = true
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success,authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }

});

//Route 3: Get loggedin user details using: Post ./api/auth/getuser. login required
router.post('/getuser',fetchuser, async (req, res) => {

try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
    
} catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Internal Server Error' });
}

})

module.exports = router;
