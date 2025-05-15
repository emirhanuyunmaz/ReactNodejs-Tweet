

export default function TagsCard({tagList}){
    const totalCount = tagList.reduce((sum, item) => sum + item.count, 0) ;

    return (<>
        {/* Duygular */}
        <div className=" bg-blue-100 p-5 rounded-xl">
            
            <h6 className="text-sm font-bold">Duygular</h6>
            <div className=" mx-3">
                <ul className="flex flex-row overflow-auto md:flex-col gap-3">
                    <li className=" md:w-full" ><a href="/tweetTagGroup/kızgın"className="flex flex-col md:flex-row justify-between w-full px-4 py-1 ">
                            <p className="border-b-2 border-blue-100 hover:border-white">
                                Kızgın  
                            </p>
                            <p>%{Math.floor(tagList?.filter((item) => item._id === "kızgın")[0]!= undefined && tagList?.filter((item) => item._id === "kızgın")[0] ? tagList?.filter((item) => item._id === "kızgın")[0]?.count/totalCount * 100 : 0)}</p>
                        </a>
                    </li>
                    <li className=" md:w-full" ><a href="/tweetTagGroup/korku" className="flex flex-col md:flex-row justify-between md:w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">
                                Korku 
                            </p>
                            <p>%{Math.floor(tagList?.filter((item) => item._id === "korku")[0]!= undefined && tagList?.filter((item) => item._id === "korku")[0] ? tagList?.filter((item) => item._id === "korku")[0]?.count/totalCount * 100 : 0)}</p>
                        </a>
                    </li>
                    <li className=" md:w-full" ><a href="/tweetTagGroup/mutlu"className="flex flex-col md:flex-row justify-between md:w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">
                                Mutlu 
                            </p>
                            <p>
                            %{Math.floor(tagList?.filter((item) => item._id === "mutlu")[0]!= undefined && tagList?.filter((item) => item._id === "mutlu")[0] ? tagList?.filter((item) => item._id === "mutlu")[0]?.count/totalCount * 100 : 0)}
                            </p>
                        </a>
                    </li>
                    <li className=" md:w-full" ><a href="/tweetTagGroup/surpriz" className="flex flex-col md:flex-row justify-between md:w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">
                                Sürpriz 
                            </p>
                            <p>
                            %{Math.floor(tagList?.filter((item) => item._id === "surpriz")[0]!= undefined && tagList?.filter((item) => item._id === "surpriz")[0] ? tagList?.filter((item) => item._id === "surpriz")[0]?.count/totalCount * 100 : 0)}
                            </p>
                        </a>
                    </li>
                    <li className=" md:w-full" ><a href="/tweetTagGroup/üzgün"className="flex flex-col md:flex-row justify-between md:w-full px-4 py-1 "><p className="border-b-2 border-blue-100 hover:border-white">
                                Üzgün 
                            </p>
                            <p>
                            %{Math.floor(tagList?.filter((item) => item._id === "üzgün")[0]!= undefined && tagList?.filter((item) => item._id === "üzgün")[0] ? tagList?.filter((item) => item._id === "üzgün")[0]?.count/totalCount * 100 : 0)}
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        
    </>)
}