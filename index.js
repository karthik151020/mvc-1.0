const express = require('express')
const app = express()
const port = 4002
const connection=require("./config")
const user=require('./models/users')
connection.sync({force:true}).then(()=>{
    console.log("Synced successfully")
})
.catch(()=>{
    console.log("Not synced")
})
app.use(express.json())
const users=require('./controllers/usersController')

app.use('/users',users)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})