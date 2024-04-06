'use client'
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithEmailAndPasswordAndRedirect = (email, password) => {
    try {
      signInWithEmailAndPassword(auth, email, password) && signIn('credentials', { email, password, redirect: true, callbackUrl: '/' }); //redirect to admin-dashboard
      
    } catch (error) {

      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
       <div className="max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex" style={{backgroundColor: '#5b9c7a'}}>
        <div className="w-56 flex-shrink-auto rounded-lg">
          <img
            className="w-full h-full object-cover"
            src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
            alt="Your Image"
          />
          </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
              <div style={{ width: '300px', height: '90px', overflow: 'hidden' }}>
                <img
                  style={{ width: '100%', height: '120%', objectFit: 'cover'}}
                  src="https://media.discordapp.net/attachments/1197323344937234464/1225573887639814289/parcel_path_7.png?ex=66219fa0&is=660f2aa0&hm=45169aea1948b7dc2d1feb88e3fd3bd659c090f1d51ff8b11afe9521f84fe9f7&=&format=webp&quality=lossless"
                  alt="Your Company"
                />
              </div>
            </div>
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <div onClick={() => router.push('/forgot-password')} className="cursor-pointer font-bold text-indigo-400 hover:text-indigo-300" style={{color: "#345454"}}>
                    Forgot password?
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => signInWithEmailAndPasswordAndRedirect(email, password)} //redirect to admin-dashboard
                disabled={!email || !password}
                className="disabled:opacity-40 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-400" style={{color: "#a4d7bb"}}>
          Not a member?{' '}
          <button onClick={() => router.push('/register/admin')} className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 "style={{color: "#345454"}}>
            Sign Up
          </button>
        </p>
      </div>
      </div>
      </div>
    </>
  );
}
