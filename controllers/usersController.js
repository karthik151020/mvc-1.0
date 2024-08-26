const express=require("express")
const route=express.Router()
const Joi=require("joi")
const {addingUsers}=require("../businessLogic/userslogic")
const connection=require("../config")
const {validateUsers,validateAdditionalInfo,validateUsersSkipping}=require("../middlewares/validateusers");
const bcrypt = require("bcrypt");
const users = require("../models/users");
const additionalinfo = require("../models/additionalUsersInfo");





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
      try{
        await users.create({
          id: usersArray[i].userId,
          firstName: usersArray[i].firstName,
          lastName: usersArray[i].lastName,
          mail: usersArray[i].mail,
          password: usersArray[i].password,
          gender: usersArray[i].gender,
          age: usersArray[i].age
      }, { transaction });
        await additionalinfo.create({
          userId: usersArray[i].userId,
          isEmailVerified: usersArray[i].isEmailVerified,
          address: usersArray[i].address,
          addressType: usersArray[i].addressType,
          paymentMode: usersArray[i].paymentMode
      }, { transaction });
      }
      catch(err){
        continue;
      }
    }

    await transaction.commit();
    return res.send({ status: "success", msg: "Users added successfully" });

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
      await addingUsers(usersArray, transaction); 
      await transaction.commit();
      return res.send("Users added successfully");
  } catch (err) {
      await transaction.rollback(); 
      console.error("Error adding users:", err); 
      return res.status(422).send({ status: "failure", msg: err.message });
  }
});

module.exports=route