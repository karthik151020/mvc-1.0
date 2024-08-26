const Joi=require("joi");
const jwt = require('jsonwebtoken');
const obj=require("../constvalues");

function validateUsers(req,res,next){
    const usersArray = req.body.usersInfoArray;
    const userValidation = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mail: Joi.string().email().required(),
      password: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required(),
      gender: Joi.string().required(),
      age: Joi.number().required(),
      userId:Joi.number()
    });
    for (let i = 0; i < usersArray.length; i++) {
      if (usersArray[i].isprimary === undefined) {
          usersArray[i].isprimary = false;
      }
      const{error: userError}=userValidation.validate({firstName:usersArray[i].firstName,lastName:usersArray[i].lastName,
        mail:usersArray[i].mail,password:usersArray[i].password,gender:usersArray[i].gender,age:usersArray[i].age,
        userId:usersArray[i].userId
      })
      if (userError) {
        return res.status(400).send({ status: 'failure', msg: userError.message });
      }
    }
    next();
  }

  function validateAdditionalInfo(req,res,next){
    const usersArray = req.body.usersInfoArray;
    const userAdditionalValidation=Joi.object({
        isEmailVerified:Joi.boolean().required(),
        address:Joi.string(),
        addressType:Joi.string(),
        paymentMode:Joi.string().required()
    })
    for (let i = 0; i < usersArray.length; i++) {
        const{error:userAdditionalinfo}=userAdditionalValidation.validate({isEmailVerified:usersArray[i].isEmailVerified,
        address:usersArray[i].address, addressType:usersArray[i].addressType,paymentMode:usersArray[i].paymentMode
        })

        if(userAdditionalinfo){
        return res.status(400).send({ status: 'failure', msg: userAdditionalinfo.message });
        }
        
    }
    next();
}

function validateUsersSkipping(user) {
    const userValidation = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mail: Joi.string().email().required(),
      password: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required(),
      gender: Joi.string().required(),
      age: Joi.number().required(),
      userId: Joi.number(),
      groupid:Joi.string(),
      isEmailVerified: Joi.boolean().required(),
      address: Joi.string(),
      isprimary:Joi.boolean(),
      addressType: Joi.string(),
      paymentMode: Joi.string().required()
    });
    
    const { error } = userValidation.validate(user);
    return error; 
  }

  function validateUserLogin(req,res,next){
    const user={username:req.body.username,password:req.body.password}
    const validations=Joi.object({
      username:Joi.string().required(),
      password:Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required()
    })

    const {error}=validations.validate(user)
    if(error){
      res.status(422).send({status:"failure",msg:error.message})
    }
    next()
  }

  function validateUserSignup(req,res,next){
    const userValidation = Joi.object({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      mail: Joi.string().email().required(),
      password: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required(),
      gender: Joi.string().required(),
      age: Joi.number().required(),
      isprimary:Joi.boolean(),
      groupid:Joi.string()
    });

    const obj={
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      mail:req.body.mail,
      password:req.body.password,
      gender:req.body.gender,
      age:req.body.age,
      groupid:req.body.groupid

    }
    if (req.body.isprimary === undefined) {
      obj.isprimary = false;
    }

    const {error}=userValidation.validate(obj)
    if(error){
      res.status(422).send({status:"failure",msg:error.message})
    }
    next()
  }


function authinticationfunction(req,res,next){
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ status: "failure", msg: "Authorization header is required" });
  }
  const parts = authHeader.split(" ");
  const token = parts[1];
  const verify=jwt.verify(token,obj.jwtPassword)
  if(!verify){
    res.status(401).send({status:"failure",msg:"Authintication token is required"});
  }

  next();
}

  module.exports={authinticationfunction,validateUsers,validateAdditionalInfo,validateUsersSkipping,validateUserLogin,validateUserSignup}