const bcrypt = require("bcrypt");
const users = require("../models/users");
const additionalinfo = require("../models/additionalUsersInfo");

async function addingUsers(usersArray, transaction) {
    for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].isprimary === undefined) {
            usersArray[i].isprimary = false;
        }
        usersArray[i].password = await bcrypt.hash(usersArray[i].password, 10);
        const addingUser = await users.create({
            id: usersArray[i].userId,
            firstName: usersArray[i].firstName,
            lastName: usersArray[i].lastName,
            mail: usersArray[i].mail,
            password: usersArray[i].password,
            gender: usersArray[i].gender,
            age: usersArray[i].age
        }, { transaction });
        if (!addingUser) {
            throw new Error('Failed to add user');
        }
        const addingUsersAdditionalInfo = await additionalinfo.create({
            userId: usersArray[i].userId,
            isEmailVerified: usersArray[i].isEmailVerified,
            address: usersArray[i].address,
            addressType: usersArray[i].addressType,
            paymentMode: usersArray[i].paymentMode
        }, { transaction });
        if (!addingUsersAdditionalInfo) {
            throw new Error('Failed to add additional info');
        }
    }
}

module.exports = { addingUsers };


// jut checkkin git origin main