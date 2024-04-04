'use client'
import React from 'react';
import './page.module.css';
import { redirect } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { auth } from '../firebase/firebase';
import 'firebase/auth';


export default function  HomePage() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  })
  const uid = auth.currentUser?.uid;

  return (
    <>
      <div className='homepage-background'>
        <div className='text-black'>Email: {session?.data?.user?.email}</div>
        <div className='text-black'>UID: {uid}</div>
        <button className='text-black' onClick={() => signOut()}>Logout</button>
        <h1>HomePage or Landing Page</h1>
      </div>
      <main>
        <p>          
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis fermentum ipsum. Duis laoreet est est, venenatis ullamcorper sem accumsan eu. Donec laoreet erat sapien, et efficitur nulla facilisis in. Maecenas vel augue orci. Mauris eu ex porttitor, venenatis lorem et, efficitur justo. Cras consectetur a lorem vel lobortis. Fusce euismod tortor facilisis, tristique elit vel, commodo risus. In in purus lectus. Suspendisse vitae elit fringilla, laoreet arcu ac, porttitor diam. Integer velit nulla, dapibus at vulputate et, bibendum a odio. Sed consectetur faucibus tortor sit amet rutrum. In vel orci bibendum, hendrerit leo at, aliquam ante. Nam sed metus euismod, dignissim justo at, rutrum libero. Nunc vitae elit purus.
        </p>
      </main>
    </>
  );
}

HomePage.requireAuth = true;
