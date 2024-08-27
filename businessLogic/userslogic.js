
const bcrypt = require("bcrypt");
const users = require("../models/users");
const additionalinfo = require("../models/additionalUsersInfo");
const userlogin=require("../models/userlogin")

async function addingUsers(usersArray, transaction) {
    for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].isprimary === undefined) {
            usersArray[i].isprimary = false;
        }

        usersArray[i].password = await bcrypt.hash(usersArray[i].password, 10);

        try {
            await users.create({
                id: usersArray[i].userId,
                firstname: usersArray[i].firstName,
                lastname: usersArray[i].lastName,
                mail: usersArray[i].mail,
                password: usersArray[i].password,
                gender: usersArray[i].gender,
                age: usersArray[i].age
            });

            await additionalinfo.create({
                userId: usersArray[i].userId,
                isEmailVerified: usersArray[i].isEmailVerified,
                address: usersArray[i].address,
                addressType: usersArray[i].addressType,
                paymentMode: usersArray[i].paymentMode
            });

        } catch (err) {
            throw err; 
        }
    }
}


async function vlaidatingUsersAndInserting(user) {
  try {
    await users.create({
      id: user.userId,
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
      password: user.password,
      gender: user.gender,
      age: user.age
    });
  
    await additionalinfo.create({
      userId: user.userId,
      isEmailVerified: user.isEmailVerified,
      address: user.address,
      addressType: user.addressType,
      paymentMode: user.paymentMode
    });
  } catch (error) {
    throw error;
  }
}
async function checkingUserPresentOrNot(username, password) {
  try {
    const userDetails = await userlogin.findOne({
      where: {
        username: username
      }
    });
    
    if (!userDetails) {
      throw new Error("User with this usename not found");
    }
    
    const comparingPassword = await bcrypt.compare(password, userDetails.password);
    if (!comparingPassword) {
      throw new Error("Password mismatch");
    }

    
  } catch (err) {
    throw err;
  }
}

async function addingUserUsingSignupRoute(obj) {
  try{
    const details=obj;
    details.password=await bcrypt.hash(details.password,10)
    await users.create(details)
    await userlogin.create({username:details.mail,password:details.password})
  }
  catch(err){
    throw err
  }
}

async function getAllUsers() {
  const usersinfo=await users.findAll()
  return usersinfo
}
  
async function getUsersById(id){
  const usersinfo=await users.findOne({
    where:{
      id:id
    }
  })
  return usersinfo
}

async function deleteAllUsers() {
  try{
    await users.destroy();
  }
  catch(err){
    throw err
  }
}

module.exports = {deleteAllUsers,getUsersById, getAllUsers,addingUsers,vlaidatingUsersAndInserting,checkingUserPresentOrNot,addingUserUsingSignupRoute };
