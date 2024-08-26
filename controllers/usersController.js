const express=require("express")
const route=express.Router()
const {addingUsers,vlaidatingUsersAndInserting,checkingUserPresentOrNot,addingUserUsingSignupRoute}=require("../businessLogic/userslogic")
const connection=require("../config")
const {authinticationfunction,validateUsers,validateAdditionalInfo,validateUsersSkipping,validateUserLogin,validateUserSignup}=require("../middlewares/validateusers");
const jwt = require('jsonwebtoken');
const obj=require("../constvalues");



route.post("/signin",validateUserLogin,async(req,res)=>{
  try{
    const username=req.body.username;
    const password=req.body.password
    await checkingUserPresentOrNot(username,password);
    const verify=jwt.sign({username:req.body.username},obj.jwtPassword,{expiresIn:obj.expiresIn});
    return res.send(verify)
  }
  catch(err){
    return res.status(422).send({status:"failure",msg:err.message})
  }

})

route.post("/signup",validateUserSignup,async(req,res)=>{
  const obj={
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    mail:req.body.mail,
    password:req.body.password,
    gender:req.body.gender,
    age:req.body.age,
    groupid:req.body.groupid
  }
  if (req.body.isprimary == undefined || req.body.isprimary == null) {
    obj.isprimary = false;
  }
  try{
    await addingUserUsingSignupRoute(obj)
    res.status(200).send({status:"success",msg:"successfully inserted the user information"})
  }
  catch(err){
    res.status(422).send({status:"failure",msg:err.message})
  }
})

route.get("/users",authinticationfunction,async(req,res)=>{
    try{
      res.send("no user")
    }
    catch(err){
      res.status(422).send({status:"failure",msg:err.message})
    }
})

route.post("/skippingUserWhileAdding", async (req, res) => {
  const usersArray = req.body.usersInfoArray;
  const transaction = await connection.transaction();

  try {
    for (let i = 0; i < usersArray.length; i++) {
      if (usersArray[i].isprimary === undefined) {
        usersArray[i].isprimary = false;
      }
      const userDetails = usersArray[i];
      const error = validateUsersSkipping(userDetails);
      if (error) {
        console.log(`Skipping user`);
        continue;
      }
      try {
         await vlaidatingUsersAndInserting(userDetails);
      } catch (err) {
        console.log(err)
        continue; 
      }
    }
    await transaction.commit();
    return res.status(200).send({ status: "success", msg: "Users added successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error("Error adding users:", err);
    return res.status(500).send({ status: "failure", msg: err.message });
  }
});


route.post("/adduserWithoutSkipping", validateUsers,validateAdditionalInfo,  async (req, res) => {
  const usersArray = req.body.usersInfoArray;
  const transaction = await connection.transaction();

  try {
      await addingUsers(usersArray); 
      await transaction.commit();
      return res.status(200).send({ status: "success", msg: "Users added successfully" });
  } catch (errors) {
    console.log(errors)
      await transaction.rollback(); 
      console.error("Error adding users:"+errors.message); 
      return res.status(422).send({ status: "failure", msg: errors.message });
  }
});

module.exports=route