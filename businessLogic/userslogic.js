
const bcrypt = require("bcrypt");
const users = require("../models/users");
const additionalinfo = require("../models/additionalUsersInfo");

async function addingUsers(usersArray, transaction) {
    for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].isprimary === undefined) {
            usersArray[i].isprimary = false;
        }

        usersArray[i].password = await bcrypt.hash(usersArray[i].password, 10);

        try {
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

        } catch (err) {
            throw err; 
        }
    }
}


async function skippingusers(user, transaction) {
    try {
      await users.create({
        id: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        password: user.password,
        gender: user.gender,
        age: user.age
      }, { transaction });
  
      await additionalinfo.create({
        userId: user.userId,
        isEmailVerified: user.isEmailVerified,
        address: user.address,
        addressType: user.addressType,
        paymentMode: user.paymentMode
      }, { transaction });
    } catch (error) {
      throw error;
    }
  }
  

module.exports = { addingUsers,skippingusers };
