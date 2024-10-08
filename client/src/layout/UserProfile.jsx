import { useParams } from "react-router-dom"


export default function UserProfile(){
    const params = useParams()
    // Kullanıcı id bilgisine göre safada gönderilerin görüntülenmesi işlemi yapılacak.
    console.log(params.id);
    
    
    return (<div>

    </div>)
}