import { useGetDemoQuery } from "./store/userApi/userApiSlicer"

function App() {

  const {data,isLoading,isError,error} = useGetDemoQuery()
  console.log(data);
  

  return (
    <>
      <h1 className="bg-red-400 text-white">Hello World</h1>      
    </>
  )
}

export default App
