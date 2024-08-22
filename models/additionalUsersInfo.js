const connection = require("../config");
const { DataTypes } = require("sequelize");
const users=require("./users")
const additionalUsersInfo = connection.define("additionalUsersInfo", {
    userId: {
        type: DataTypes.INTEGER,
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN
    },
    updatedBy: {
        type: DataTypes.STRING(50)
    },
    address: {
        type: DataTypes.STRING(100)
    },
    addressType: {
        type: DataTypes.STRING(10)
    },
    paymentMode: {
        type: DataTypes.STRING(20)
    }
}, {
    timestamps: false,

});

module.exports = additionalUsersInfo;
