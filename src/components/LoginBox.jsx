import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from './ui/button'
import toast from 'react-hot-toast'

const LoginBox = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('https://trackxback.onrender.com/user/login', {
        email,
        password
      })

      const token = res.data.token
      localStorage.setItem('token', token)

      toast.success("Login successful!")
      navigate('/userdash')
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message)
      toast.error(err.response?.data?.error || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='my-4 flex justify-center align-center w-screen min-h-[400px]'>
      <div className='p-4 w-[280px] h-full bg-zinc-100 rounded-2xl shadow-sm'>
        <div className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-4/6 after:border-b-4 after:border-zinc-700 after:rounded-full text-3xl mb-6 py-2">
          <span className="py-2 font-mono text-zinc-700">Welcome Back!!!</span>
        </div>

        <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            className="border-solid border-[1px] border-zinc-600"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            className="border-solid border-[1px] border-zinc-600"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            className={`bg-zinc-600 my-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Submit'}
          </Button>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link to={'/signup'} className="text-blue-700">Don't have an account? Signup</Link>
        </form>
      </div>
    </div>
  )
}

export default LoginBox
