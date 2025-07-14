import React from 'react'
import Logo from '@/components/Logo'
import SignBox from '@/components/SignBox'
import { Toaster } from 'react-hot-toast'

const Signup = () => {
  return (
    <div className="bg-zinc-800 w-full h-screen flex flex-col">
      {/* Toast Notification */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            fontFamily: 'monospace',
            borderRadius: '8px',
          },
        }}
      />

      <Logo />
      <SignBox />
    </div>
  )
}

export default Signup
