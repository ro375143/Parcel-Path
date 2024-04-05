'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { createUserProfile } from '@/app/firebase/utils'


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();


  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(email, password);
  //     if (userCredential.user) {
  //       await createUserProfile(userCredential.user.uid, email); // Set the user's role in Firestore
  //       console.log("User profile created successfully.");
  //       setEmail('');
  //       setPassword('');
  //       router.push('/login'); // Redirect to login page or perhaps a welcome page
  //     }
  //   } catch(e) {
  //     console.error(e);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential && userCredential.user) {
        await createUserProfile(userCredential.user.uid, email);
        console.log("User profile created successfully.");
        setEmail('');
        setPassword('');
        router.push('/login');
      } else {
        // Handle case where user creation fails but no error is thrown
        console.error("Failed to create user account.");
      }
    } catch(e) {
      console.error(e);
      // Display error message to user, e.g., using a state variable
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input type="email" placeholder="Email" 
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input type="password" placeholder="Password" 
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex items-baseline justify-between">
            <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
