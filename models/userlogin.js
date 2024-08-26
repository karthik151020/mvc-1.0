const connect=require("../config");
const {DataTypes, Model}=require("sequelize")

const userlogin=connect.define("userlogin",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING(50)
    },
    password:{
        type:DataTypes.STRING(250)
    }
},
{
    timestamps:false
})

module.exports=userlogin