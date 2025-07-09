import React from 'react'
import Marquee from "react-fast-marquee";
import { Button } from "@/components/ui/button"
import Logo from '../components/Logo'
import { Link } from 'react-router-dom';

const App = () => {
  return (

  <div className=' bg-zinc-800 w-full h-screen flex flex-col'>
    <div className='flex justify-between w-screen'>
      <Logo/>
      <Link className='p-4' to={'/login'}> 
     <Button className=" border-white border-solid border-[1px]  hover:scale-105 hover:bg-zinc-800">Get Started </Button>
     </Link> 
    </div>
    <div className='h-3/6 flex items-center md:w-2/3'><div className='p-4 text-4xl md:text-6xl text-zinc-300'>
      track your projects in an <span className='text-yellow-500'>innovative</span> way
    </div>
    <div className='flex justify-start items-center h-[100px] p-4'>
     
     </div>
     </div>  
        <Marquee className=' overflow-hidden text-6xl text-zinc-700 font-extrabold' speed={60} gradient={false}>
     | CREATE || CONTRIBUTE || CONQUER || CREATE || CONTRIBUTE || CONQUER |
    </Marquee>
  </div>

  )
}

export default App
