const express = require("express")
const app = express()
const dotenv = require('dotenv');
const { spawn } = require('child_process');

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
function runPythonModel(inputData) {
    const pythonProcess = spawn('python', [__dirname + '/predict.py', inputData]);

  
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Prediction: ${data.toString()}`);
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data.toString()}`);
    });
  
    pythonProcess.on('close', (code) => {
      console.log(`Process exited with code: ${code}`);
    });
  }
app.get("/",async (req,res) => {
    // console.log(req.headers);
    console.log("asddsa");
    
    const inputData = "Allah'ım çıldıracağım. Yemin ederim çıldıracağım sinirimden. Bir yerden de çıkaramıyorum cam çerçeve indireceğim şimdi ne varsa."  // Örnek girdi
    runPythonModel(inputData);
    
    res.status(201).json({message:"succes"})
})


module.exports = app