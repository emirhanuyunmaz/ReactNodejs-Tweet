import UserSearchCard from "./UserSearchCard";

export default function UserSearchList({userList}){


    return(<div  className="w-[87%] md:w-auto flex h-full flex-col items-center absolute ">/
        <div className="w-full  h-auto max-h-[50%] overflow-auto bg-white px-4 py-2 border-2 rounded-xl ">
            <div className=" flex flex-col items-center gap-3 ">
                {
                    userList.map((user) => <UserSearchCard key={user._id} user={user}/> )
                }
                
            </div>
        </div>
    </div>)
}