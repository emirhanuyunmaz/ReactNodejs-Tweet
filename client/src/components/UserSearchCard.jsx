
export default function UserSearchCard({user}){
    return(<a href={`/user/${user._id}`} className="bg-blue-300 flex items-center px-3 w-full py-2 rounded-xl gap-3 hover:bg-blue-400 duration-300 cursor-pointer">
        <img src={`http://localhost:3000/user/profile/image/${user.image}`} className="w-16 h-16 rounded-full" alt="" />
        <p>{user.name} {user.surname}</p>
    </a>)
}