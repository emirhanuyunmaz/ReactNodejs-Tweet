const express = require("express")
const app = express()
const dotenv = require('dotenv');
const utf8 = require("utf8")

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
//Deneme ve kontrol için oluşturulmuştur.
// Python dosyasını çalıştırma fonksiyonu

app.get("/",async (req,res) => {
    // console.log(req.headers);
    console.log("asddsa");
    
    res.status(201).json({message:"succes"})
})


module.exports = app