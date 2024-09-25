import { Heart, MessageCircle, Repeat2, Search } from "lucide-react";


export default function Tweet(){



    return(
    <div className="flex w-full md:min-h-[90vh] justify-center ">
        
        <div className="flex flex-col-reverse md:flex-row w-full md:w-3/4  md:gap-5">
            <div className="flex flex-col mt-5 md:mt-0 w-full  md:p-5">
                {/* ADD TWEET */}
                <div className="flex flex-col md:flex-row  w-full gap-5 mb-5 px-16 md:px-0 md:mx-16">
                    <textarea placeholder="Tweet" className="outline-none border-2 p-3 w-full md:w-3/4 min-h-32 max-h-32 rounded-xl"/>
                    <button className="bg-blue-200 hover:bg-blue-400 hover:text-white duration-300 px-4 py-1 rounded-xl">Add</button>
                </div>
                {/* TWEET LIST */}
                <div className="flex flex-col mx-16 gap-3 border-2 bg-blue-100 p-3 rounded-xl hover:shadow-xl duration-300">
                    {/* USER */}
                    <div className="flex items-center gap-5">
                        <img className="w-10 h-10 rounded-full" src="https://randomuser.me/api/portraits/men/75.jpg" alt="" />
                        <div className="flex flex-col">
                            <a href="/userID">USER NAME</a>
                            <p className="text-xs">12/12/2024 18:00</p>
                        </div>
                    </div>
                    {/* TWEET */}
                    <div className="ms-10">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis cum deleniti incidunt magni. Veritatis fugit eius, aspernatur cum deleniti consectetur, at recusandae soluta voluptates, blanditiis quisquam aperiam. Recusandae, molestias eos?</p>
                    </div>
                    <div className="flex justify-between md:px-32">
                        <button className="flex gap-1 "><Heart  color="red" fill={`red`} /> 5</button>
                        <button className="flex gap-1 "><Repeat2 />12</button>
                        <button className="flex gap-1 "> <MessageCircle />20</button>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col w-full md:w-1/4 px-16 md:px-0 md:p-5">
                <div className="flex justify-between w-full rounded-xl border-2 bg-white px-2">
                    <input type="text" placeholder="Serach" className="outline-none px-2 py-1 "/>
                    <button className="hover:text-blue-500 duration-300"><Search /></button>
                </div>
                <div className="mt-5 bg-blue-100 p-5 rounded-xl">
                    <h6 className="text-sm font-bold">Etiketler</h6>
                    <div className=" mx-3">
                        <ul className="flex flex-wrap md:flex-col gap-3">
                            <li className="w-full" ><a href="" className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Lorem.</p></a></li>
                            <li className="w-full" ><a href=""className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Deserunt.</p></a></li>
                            <li className="w-full" ><a href="" className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Lorem.</p></a></li>
                            <li className="w-full" ><a href=""className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Deserunt.</p></a></li>
                            <li className="w-full" ><a href="" className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Lorem.</p></a></li>
                            <li className="w-full" ><a href=""className="flex  w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">Deserunt.</p></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            


        </div>
    </div>)
}