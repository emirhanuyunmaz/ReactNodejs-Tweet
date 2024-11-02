const app = require("./routes")

const mongoose = require('mongoose')
async function main(){
    try{

        mongoose.connect('mongodb://127.0.0.1:27017/tweet').then(() => console.log('Connected!'));
        
        
        app.listen(3000,() =>{
            console.log("Listening port 3000");
        })
    }catch(err){
        console.log("ERR:",err);
        
    }
}

main()