const connection = require("../config");
const { DataTypes } = require("sequelize");
const additionalUsersInfo = require("./additionalUsersInfo");

const users = connection.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING(50)
    },
    lastName: {
        type: DataTypes.STRING(50)
    },
    mail: {
        type: DataTypes.STRING(50)
    },
    password: {
        type: DataTypes.STRING(250)
    },
    age: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.STRING(1)
    },
    isprimary: {
        type: DataTypes.BOOLEAN
    },
    groupid: {
        type: DataTypes.STRING(10),
        defaultValue: "Group A"
    },
    updatedBy: {
        type: DataTypes.STRING(50)
    }
}, {
    timestamps: false
});

users.associate = function(models) {
    users.hasMany(models.additionalUsersInfo, {
        foreignKey: 'userId',
    });
};

module.exports = users;


//in users