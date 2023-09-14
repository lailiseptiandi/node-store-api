const validator = require('joi');
const model = require('../models')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {sendErrorResponse, sendSuccessResponse} = require("../helpers/helper");

const userRequiredField = validator.object({
    name: validator.string().required(),
    email: validator.string().email().required(),
    password: validator.string().min(8).required(),
    role: validator.string()
});

const userLoginRequiredField = validator.object({
    email: validator.string().email().required(),
    password: validator.string().min(8).required(),
});

function registerUser(req, res){

    const { error } = userRequiredField.validate(req.body);
    let date = new Date();

    if (error) {
        sendErrorResponse(res, error.details[0].message);
        return;
    }
   
    let data = {
        name : req.body.name,
        email : req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        created_at: date,
        updated_at: date,
    }

    model.userModel.createUser(res,data, function(err, user){
        if (err) {
            // Handle the error here
           return  sendErrorResponse(res, err);
        } else {
            const token = jwt.sign({user_id: user.id, email: user.email, name: user.name, user:user.role, },
                process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRED_TIME * 60, 
            });

              const userData = {
                id : user.id,
                email : user.email,
                role : user.role,
                type : "Bearer",
                access_token : token
            }
            // Successfully register users
            return sendSuccessResponse(res, 'Register successfully', userData);
        }
    })
}

function login(req, res){

  const { error } = userLoginRequiredField.validate(req.body);

  if (error) {
      sendErrorResponse(res, error.details[0].message);
      return;
  }
  const { email, password } = req.body;

  // Find user by email
  model.userModel.findUserByEmail(email, function(err, user) {
    if (err) {
      return sendErrorResponse(res, "Database error", 500);
    }

    if (!user) {
     return sendErrorResponse(res, "User not found");
    }

    // Compare password
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return sendErrorResponse(res, "Invalid Password!");
    }
    // Generate a JWT token
    const token = jwt.sign({user_id: user.id, email: user.email, name: user.name },
         process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRED_TIME * 60, 
    });
    const userData = {
        id : user.id,
        email : user.email,
        type : "Bearer",
        access_token : token
    }

    return sendSuccessResponse(res, "Login Successfully", userData);
  });
}

function profilUser(req, res){
  const stringToken = req.headers['authorization'];
     // get token Bearer tokenString 
  const token = stringToken.split(" ")[1]

  const decodedToken = jwt.verify(token,process.env.JWT_SECRET );

  model.userModel.findUserByEmail(decodedToken.email, function(err, user) {
    const userData = {
      id : user.id,
      email: user.email,
      role : user.role
    }
    return sendSuccessResponse(res, "Profile user succesfully", userData);
  });
 
}

module.exports = {
    registerUser,
    login,
    profilUser,
}