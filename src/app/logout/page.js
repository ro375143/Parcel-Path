'use client'
import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { auth } from '../../firebase/firebase'

const LogOutPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      signOut(); //no idea why I have to sign out of both
      auth.signOut(); 
    }

    const redirectTimer = setTimeout(() => {
      window.location.href = '/'; 
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [session]);

  return (
    <div>
      <h1>You've been successfully logged out</h1>
      <p>Redirecting back to homepage...</p>
    </div>
  );
}

export default LogOutPage;
