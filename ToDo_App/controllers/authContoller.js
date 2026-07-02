const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(req, res) {
  let {firstName, lastName, userName, password} = req.body;
  try {
    const duplicate = await User.find({userName});
    if(duplicate && duplicate.length > 0) return res.status(400).send({message: "User already registered with this username"});
    let user = new User({firstName, lastName, userName, userPassword: password});
    const result = await user.save();
    console.log(result);
    res.status(201).send({message: "User registered successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

async function loginUser(req, res) {
  try {
    const {userName, password} = req.body;
    const user = await User.findOne({userName});
    if(!user) return res.status(404).send({message: "User not found"});
    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(401).send({message: "Invalid password"});
    let token = jwt.sign({userId:user?._id}, JWT_SECRET, {expiresIn: '1h'});
    let finalData = {
      userId: user?._id,
      userName: user?.userName,
      firstName: user?.firstName,
      lastName: user?.lastName,
      token
    }
    res.send(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

const AuthController = {
  registerUser,
  loginUser
}

module.exports = AuthController;