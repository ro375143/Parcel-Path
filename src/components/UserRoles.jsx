'use client'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/firebase/config'; // Adjust the import path as necessary
import { doc, getDoc } from 'firebase/firestore';

const useAuthorize = (expectedRole) => {
  const [user, loading, error] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authCheckDone, setAuthCheckDone] = useState(false); // New state to manage auth check completion
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === expectedRole) {
          setIsAuthorized(true);
        } else {
          router.push('/unauthorized');
        }
      }
      setAuthCheckDone(true); // Mark that the auth check has completed
    };

    if (!loading) {
      checkRole();
    }
  }, [user, loading, expectedRole, router]);

  return { isAuthorized, authCheckDone }; // Return the new state along with the authorization status
};

export default useAuthorize;