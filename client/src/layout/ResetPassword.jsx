import { useState } from "react";
import SendEmail from "../components/SendEmail";
import ChangePassword from "../components/ChangePassword";



export default function ResetPassword(){
    const [position,setPosition] = useState(0)


    return (<div className="h-[75vh] flex flex-col justify-center items-center gap-3 ">
        {position == 0 && <SendEmail setPosition={setPosition}/>}
        {position == 1 && <ChangePassword/>}
    </div>)
}