const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "KartikThawait$01";
const fetchUser = require("../middleware/fetchUser");




//Route 1: Create a user using: Post "/api/auth/createuser". Doesn't requre checking
router.post(
  "/createuser",
  [
    body("Name", "Enter a valid Name").isLength({ min: 5 }),
    body("Email", "Enter a valid Email").isEmail(),
    body("Password", "Enter a valid Password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    //if there are error return bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:success,errors: errors.array() });
    }

    //check whether the user with this email exits already

    try {
      let user = await User.findOne({ Email: req.body.Email });
      if (user) {
        return res
          .status(400)
          .json({success:success, error:  "Sorry a user with this email allready exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.Password, salt);

      user = await User.create({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      var authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 2: Create a user using: Post "/api/auth/login". Doesn't requre Login
router.post(
  "/login",
  [
    body("Email", "Enter a valid Email").isEmail(),
    body("Password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there are error return bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let success=true;
    const { Email, Password } = req.body;
    try {
      let user = await User.findOne({ Email: req.body.Email });
      if (!user) {
        success=false;
        return res
          .status(400)
          .json({ error: "Please login with correct Email Password",success:success });
      }
      const Passwordcompare = await bcrypt.compare(Password,user.Password);
      if(!Passwordcompare)
      {
        success=false;
        return res
        .status(400)
        .json({ error: "Please login with correct Email Password", success:success});
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      var authtoken = jwt.sign(data, JWT_SECRET);

      res.json({success, authtoken });

     
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


//Route 3: Getting user details: Post "/api/auth/getuser". Login required
router.post('/getuser',fetchUser, async (req,res)=>{

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-Password");
    res.send(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
