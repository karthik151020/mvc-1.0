const {Sequelize}=require("sequelize")

const connection=new Sequelize('mvc', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql'
  });

try{
    connection.authenticate();
    console.log("Connected");
}
catch(e){
    console.log(e);
}

module.exports=connection;