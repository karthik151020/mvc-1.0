const express=require("express")
const route=express.Router()
const {getUsersById,getAllUsers,addingUsers,vlaidatingUsersAndInserting,checkingUserPresentOrNot,addingUserUsingSignupRoute,deleteAllUsers}=require("../businessLogic/userslogic")
const connection=require("../config")
const {authinticationfunction,validateUsers,validateAdditionalInfo,validateUsersSkipping,validateUserLogin,validateUserSignup,roleBasedAccess}=require("../middlewares/validateusers");
const jwt = require('jsonwebtoken');
const obj=require("../constvalues");
const roleobj=require("../access")



route.post("/signin",validateUserLogin,async(req,res)=>{
  try{
    const username=req.body.username;
    const password=req.body.password
    await checkingUserPresentOrNot(username,password);
    const verify=jwt.sign({username:req.body.username},obj.jwtPassword,{expiresIn:obj.expiresIn});
    return res.send({status:"success",token:verify})
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

route.get("/getallUsers",roleBasedAccess(roleobj.getallUsers),authinticationfunction,async(req,res)=>{
    try{
      const details=await getAllUsers();
      res.status(200).send({status:"success",msg:"got all the users",details})
    }
    catch(err){
      res.status(422).send({status:"failure",msg:err.message})
    }
})

route.get("/userById/:id",roleBasedAccess(roleobj.userById),authinticationfunction,async(req,res)=>{
  try{
    const userId=req.params.id;
    const details=await getUsersById(userId);
    res.status(200).send({status:"success",msg:"got all the users",details})
  }
  catch(err){
    res.status(422).send({status:"failure",msg:err.message})
  }
})

route.delete("/deleteAllUsers",roleBasedAccess(roleobj.getallUsers),authinticationfunction,async(req,res)=>{
  try{
    deleteAllUsers();
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