import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from './ui/button';
import toast from 'react-hot-toast';

const SignBox = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://trackxback.onrender.com/user/signup', {
        email,
        password,
        name: email.split('@')[0],
      });

      toast.success("Signup successful!");
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='my-4 flex justify-center w-screen min-h-[400px]'>
      <div className='p-4 w-[280px] bg-zinc-100 rounded-2xl shadow-sm'>
        <div className="text-3xl mb-6 text-zinc-700 font-mono border-b-4 border-zinc-700 w-fit pb-1 mx-auto">
          Sign Up!!!
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            className="border border-zinc-600"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            className="border border-zinc-600"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <Button type="submit" className="bg-zinc-600 my-2" disabled={loading}>
            {loading ? "Signing up..." : "Submit"}
          </Button>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link to="/login" className="text-blue-700 text-center">
            Have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignBox;
