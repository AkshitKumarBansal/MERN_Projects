const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {Schema} = mongoose;

const userSchema = new Schema({
  firstName : String,
  lastName : String,
  userName : {type : String, required : true},
  userPassword : {type : String, required : true},
});

userSchema.pre('save', async function() {
  const user = this;
  if(!user.isModified('userPassword')) return; // check if the password is modified, if not, skip hashing
  let salt = await bcrypt.genSalt(10); // generate a salt with 10 rounds
  let hash = await bcrypt.hash(user.userPassword, salt); // hash the password with the generated salt
  user.userPassword = hash;
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.userPassword); // compare the provided password with the hashed password in the database
};

const User = mongoose.model("User", userSchema);

module.exports = User;