const express = require("express")
const app = express()
const dotenv = require('dotenv');

const cors = require("cors")
const cookieParser = require("cookie-parser")

const signupRouter = require("./singnup")
const loginRouter = require("./login")
const userRouter = require("./user")

app.use(cors({credentials: true , origin: true}))
app.use(express.json({limit:"500mb"}))//Verilerin json olarak fe alınabilmesini sağalar.
app.use(cookieParser())
dotenv.config()//.env dosyasına erişim için gerekli
app.use(express.static('uploads'));

//*******************ROUTERS*****************//

app.use("/signup",signupRouter)
app.use("/login",loginRouter)
app.use("/user",userRouter)

module.exports = app