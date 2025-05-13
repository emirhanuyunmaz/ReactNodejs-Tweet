const express = require("express")
const router = express.Router()
const {SignUpModel,ResetPasswordCodeModel} = require("./model")
const uuid = require("uuid")
const fs = require("fs")
const nodemailer = require("nodemailer")

const sendEmailHTML = (code) => {
    return `
    <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Şifre Sıfırlama Kodu</title>
        <style>
            body {
            background-color: #f4f4f7;
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
            }
            .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .logo {
            text-align: center;
            margin-bottom: 20px;
            }
            .logo img {
            width: 80px;
            }
            h1 {
            font-size: 24px;
            text-align: center;
            color: #1da1f2;
            }
            p {
            font-size: 16px;
            line-height: 1.6;
            }
            .code-box {
            text-align: center;
            margin: 30px 0;
            }
            .code {
            display: inline-block;
            background-color: #f0f4f8;
            padding: 15px 25px;
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            border-radius: 8px;
            letter-spacing: 5px;
            }
            .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Şifre Sıfırlama Kodu</h1>
            <p>Merhaba,</p>
            <p>Hesabınız için bir şifre sıfırlama isteği aldık. Aşağıda sizin için oluşturulan doğrulama kodunu bulabilirsiniz:</p>
            <div class="code-box">
            <div class="code">${code}</div>
            </div>
            <p>Bu kodu uygulamadaki veya sitedeki ilgili alana girerek şifre sıfırlama işlemini tamamlayabilirsiniz.</p>
            <p>Eğer bu işlemi siz başlatmadıysanız, bu e-postayı dikkate almayabilirsiniz.</p>
            <p>Teşekkürler,<br>Twitter Clone Ekibi</p>
            <div class="footer">
            Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
            </div>
        </div>
        </body>
        </html>
    `
}

//************************SIGN UP****************************/
//Yeni kullanıcı ekleme işlemi.
const signup = async (req,res) => {
    console.log("Kullanıcı kayıt için istek atıldı");
    console.log(req.body);
    const imageName = uuid.v4()
    const filePath =`uploads/${imageName}.png`
    console.log("File Path:",filePath);
    let base64Image = req.body.image.split(';base64,').pop();

    fs.writeFile( __dirname + "/../" + filePath ,base64Image , {encoding: 'base64'}, function(err) {
        console.log(`File created ${imageName} `);
    });
    
    try {
        const newUser = new SignUpModel({
            name:req.body.name,
            surname:req.body.surname,
            email:req.body.email,
            password:req.body.password,
            description:req.body.description,
            image:filePath
        })
        await newUser.save().then(() => console.log("Save user"))
        res.status(201).json({"message":"Succes"})
    }catch(err){
        res.status(400).json({"message":err})
    }
}

// ********************** RESET PASSWORD ************************ //
// Parola yenilemek için code gönderme işlemi
const resetPasswordSendCode = async (req,res) => {
    try{

        const email = req.body.email
        console.log("GELEN EMAIL :",email);
        const userControl = await SignUpModel.findOne({email:email})
        console.log(userControl);
        if(userControl){
            console.log("Mail Var");
            
            if(email){
                const code = Math.floor(Math.random()*90000) + 10000;
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    // secure: true, // true for port 465, false for other ports
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });
                
                const info = await transporter.sendMail({
                    from: process.env.EMAIL_ADDRESS, // sender address
                    to: email, // list of receivers
                    subject: 'Twitter Clone | Şifre Sıfırlama', // Subject line
                    // text: "Hello world?", // plain text body
                    html: sendEmailHTML(code), // html body
                });
                console.log(":RESET PASSWORD:");
                
                console.log(process.env.EMAIL);
                console.log(process.env.EMAIL_PASSWORD);
                
                await new ResetPasswordCodeModel({
                    email:email,
                    code:code,
                }).save()
                
                res.status(200).json({message:"Mail gönderildi",succes:true})
            }
            else{
                console.log("Mail adresi girilmemiş");
                res.status(400).json({message:"Mail adresi gelmedi"})
            }
        }else{
            console.log("Mail Adresi bulunamadı");
            
            res.status(404).json({message:"Mail Adresi Bulunamadı"})
        }
    }catch(err){
        console.log("Kullanıcı şifre yenileme için kod gönderilirken bir hata ile karşılaşıldı.",err);
        res.status(400).json({message:err,succes:false})
    }
}

const changePassword = async(req,res) => {
    try{
        
        // Parola değiştirme .
        const password = req.body.password
        const email = req.body.email
        const code = req.body.code
        
        const control = await ResetPasswordCodeModel.find({email:email,code:code})
        if(control){
            console.log("Parola değiştirme ve code kontrol işlemi başarılı.",email);
            console.log("Parola değiştirme ve code kontrol işlemi başarılı.",password);
            console.log("Parola değiştirme ve code kontrol işlemi başarılı.",code);
            await SignUpModel.findOneAndUpdate({email:email},{password:password})
            await ResetPasswordCodeModel.deleteMany({email:email})
            res.status(201).json({message:"Succes",succes:true})
        }else{
            res.status(404).json({message:"Kod veya mail hatalı."})
        }

    }catch(err){
        console.log("Parola değitirilirken bir hata ile karşılaşıldı.",err);
        res.status(404).json({message:err,succes:false})
    }
}

//******************************ROUTER******************************/

router.route("/resetPasswordSendCode").post(resetPasswordSendCode)
router.route("/changePassword").post(changePassword)
router.route("/").post(signup)


module.exports = router