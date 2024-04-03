'use client'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function userSignup() {
  const router = useRouter();
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRetype, setRetypePassword] = useState('');
  //const [address, setAddress] = useState('');

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const creationTimestamp = userCredential.user.metadata.creationTime;
      const uid = userCredential.user.uid;
  
      await setDoc(doc(db, 'user', uid), {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        //address: address,  //Do we need address????
        created_At: creationTimestamp
      });
      router.push('/success'); //redirect to admin dashboard
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };
  
  return (
    <>
 <div className="flex justify-center items-center h-screen">
       <div className="max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-56 flex-shrink-auto rounded-lg">
          <img
            className="w-full h-full object-cover"
            src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
            alt="Your Image"
          />
          </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" style={{backgroundColor: '#5b9c7a'}}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=%345454"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="firstName"
                    autoComplete="firstName"
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="lastName"
                    autoComplete="lastName"
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email
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
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
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
                disabled={(!email || !password )}
                onClick={signup}
                className="disabled:opacity-40 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-gray-400" style={{color: "#a4d7bb"}}>
          Already a member?{' '}
          <button onClick={() => router.push('../login/user')} className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300" style={{color: "#345454"}}>
            Sign In
          </button>
        </p>
      </div>
      </div>
      </div>
    </>
  );
}
