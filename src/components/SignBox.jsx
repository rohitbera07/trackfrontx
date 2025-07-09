import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from './ui/button';

const SignBox = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // to redirect after signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://trackxback.onrender.com/user/signup', {
        email,
        password,
        name: email.split('@')[0] // simple name fallback
      });

      console.log('Signup success:', res.data);
      navigate('/login'); // redirect to login after signup
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className='my-4 flex justify-center align-center w-screen min-h-[400px]'>
      <div className='p-4 w-[280px] h-full bg-zinc-100 rounded-2xl shadow-sm'>
        <div className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/6 after:border-b-4 after:border-zinc-700 after:rounded-full text-3xl mb-6 py-2">
          <span className="py-2 font-mono text-zinc-700">Sign Up!!!</span>
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
          <Button type="submit" className="bg-zinc-600 my-2">Submit</Button>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link to="/login" className="text-blue-700">Have an account? Login</Link>
        </form>
      </div>
    </div>
  );
};

export default SignBox;
