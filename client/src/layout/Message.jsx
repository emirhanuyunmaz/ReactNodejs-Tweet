

export default function Message(){

    // Backend ile tarihe göre gruplandırma ve çekme işlemi yapılcak


    return(<div className="h-[90vh] flex justify-center items-center rounded-xl">
        
        <div className="h-[95%] w-[90%] bg-blue-200 flex rounded-xl  " >
            
            <div className="w-1/4 border-r-2 border-gray-200  h-full ">
                {/* Kullanıcı arama işlemi için input */}
                <div className="flex flex-col md:flex-row  justify-center items-center gap-1 mx-5 pt-5 mb-5">
                    <input className="outline-none px-4 py-2 border-2 rounded-xl " type="text" placeholder="Kullanıcı Adı"/>
                    <button className="border-2 px-8 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300  ">Ara</button>
                </div>

                {/* Mesajlaşılan kullanıcı kart tasarımı  */}
                <div className="bg-blue-300 mx-5 rounded-xl cursor-pointer flex items-center hover:bg-blue-400 hover:text-white duration-300">
                    <img src="https://randomuser.me/api/portraits/men/78.jpg" className="w-16 h-16 my-1 mx-3 rounded-full" alt="" />
                    <p>USER NAME</p>
                </div>

            </div>

            {/* Mesajlaşma kısmı */}
            <div className="w-3/4 h-[full] ">
                
                {/* Mesajların listesi */}
                <div className="h-[90%] w-full flex flex-col  px-3 pt-3 overflow-y-auto overflow-x-hidden">
                    <div className="flex justify-center items-center">
                        <p className="underline">12/12/2024</p>
                    </div>    
                    {/* Gelen Mesaj */}
                    <div className="border-2 rounded-r-xl rounded-t-xl px-6 py-2 me-auto">
                        <p>Hello</p>
                        <p className="text-[10px] text-end">12:12</p>
                    </div>

                    {/* Giden Mesaj */}
                    <div className="flex flex-col border-2 rounded-l-xl rounded-t-xl px-6 py-2 ms-auto">
                        <p>Hello</p>
                        <p className="text-[10px]">12:12</p>
                    </div>


                </div>

                {/* Mesaj atma işlemi */}
                <div className="flex  w-full h-[10%] items-center justify-center gap-2 px-2">
                        <input className="w-[90%] outline-none px-4 py-2 border-2 rounded-xl" type="text" placeholder="Mesaj"/>
                        <button className="w-[10%] border-2 px-2 py-2 rounded-xl bg-blue-300 hover:bg-blue-400 hover:text-white duration-300">Gönder</button>
                </div>
            </div>

        </div>
        


    </div>)
}