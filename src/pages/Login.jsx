import LoginBox from '@/components/LoginBox'
import Logo from '@/components/Logo'
import React from 'react'

const Login = () => {
  return (
    <div  className=' bg-zinc-800 w-full h-screen flex flex-col'>
      <Logo/>
      <LoginBox/>
    </div>
  )
}

export default Login
