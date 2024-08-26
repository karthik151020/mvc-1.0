const express = require('express')
const app = express()
const port = 4002
const connection=require("./config")
const user=require('./controllers/usersController')
const userlogin=require("./models/userlogin");
connection.sync({force:true}).then(()=>{
    console.log("Synced successfully")
})
.catch(()=>{
    console.log("Not synced")
})
app.use(express.json())

app.use('/users',user)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})