const express = require("express")
const router = express.Router()
const SignUpModel = require("./model")
const multer  = require('multer')
const path = require('path');
const uuid = require("uuid")
const fs = require("fs")
// const imgconfig = multer.diskStorage({
//     destination:(req, file,callback)=>{
//         callback(null,'uploads')
//     },
//     filename:(req, file, callback)=>{
//         const imageName = uuid.v4()
//         req.body.image =  imageName + ".png"
//         callback(null, `${imageName}.png`)
//     }
// })

// //image filter
// const upload = multer({
//     storage: imgconfig,
//     limits:{fileSize:'1000000'},
//     fileFilter:(req, file, callback)=>{
//         const fileType = /jpeg|jpg|png|gif/
//         const mimeType = fileType.test(file.mimetype)
//         const extname = fileType.test(path.extname(file.originalname))
//         if(mimeType && extname){
//             return callback(null, true)
//         }
//         callback('Give proper file format to upload')
//     }
// }).single('image')

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


//******************************ROUTER******************************/

router.route("/").post(signup)


module.exports = router