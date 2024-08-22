const express=require("express")
const route=express.Router()
const Joi=require("joi")
const addingUsers=require("../businessLogic/userslogic")
const connection=require("../config")

function usersValidations(req,res,next){
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
  
function useradditionalinfovalidations(req,res,next){
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

route.post("/adduser",useradditionalinfovalidations,usersValidations,async (req,res)=>{
    const usersArray = req.body.usersInfoArray;
    const transaction = await connection.transaction();
    try{
        addingUsers(usersArray,transaction)
        await transaction.commit();
        return res.send("Users added successfully");
    }
    catch(err){
        return res.status(422).send({status:"failure",msg:err})
    }
    
})

module.exports=route