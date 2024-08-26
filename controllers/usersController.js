const express=require("express")
const route=express.Router()
const Joi=require("joi")
const {addingUsers}=require("../businessLogic/userslogic")
const connection=require("../config")
const {validateUsers,validateAdditionalInfo}=require("../middlewares/validateusers");


route.post("/adduser", validateUsers,validateAdditionalInfo,  async (req, res) => {
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