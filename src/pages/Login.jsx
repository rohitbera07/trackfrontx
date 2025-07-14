import React from 'react'
import LoginBox from '@/components/LoginBox'
import Logo from '@/components/Logo'
import { Toaster } from 'react-hot-toast'

const Login = () => {
  return (
    <div className='bg-zinc-800 w-full h-screen flex flex-col'>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            fontFamily: 'monospace',
          },
        }}
      />
      <Logo />
      <LoginBox />
    </div>
  )
}

export default Login
