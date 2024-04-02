'use client'
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, error] = useSignInWithEmailAndPassword(auth);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/'); // Redirect to home if already logged in
    }
  }, [user, loading, router]);

  const handleSubmit = async (event) => {
    try {
        const res = await signInWithEmailAndPassword(email, password);
        console.log(res)
        setEmail('');
        setPassword('');
        router.push('/register')
    } catch(e){
      console.error(e)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block" htmlFor="email">Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
          <div className="flex items-baseline justify-between">
            <button 
              type="submit" 
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
