const express = require("express")
const app = express()
const dotenv = require('dotenv');
const utf8 = require("utf8")

const cors = require("cors")
const cookieParser = require("cookie-parser")

const signupRouter = require("./singnup")
const loginRouter = require("./login")
const userRouter = require("./user")
const contactRouter = require("./contact")
const messageRouter = require("./message")

app.use(cors({credentials: true , origin: true}))
app.use(express.json({limit:"500mb"}))//Verilerin json olarak fe alınabilmesini sağalar.
app.use(cookieParser())
dotenv.config()//.env dosyasına erişim için gerekli
app.use("/uploads",express.static('uploads'))

//*******************ROUTERS*****************//


// app.use("/uploads",express.static('uploads'))
app.use("/signup",signupRouter)
app.use("/login",loginRouter)
app.use("/user",userRouter)
app.use("/contact",contactRouter)
app.use("/message",messageRouter)


app.get("/",async (req,res) => {
    // console.log(req.headers);
    console.log("HELLO WORLD");
    
    res.status(201).json({message:"succes"})
})


module.exports = app