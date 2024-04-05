import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export const createUserProfile = async (userId, email) => {
  await setDoc(doc(db, 'users', userId), {
    email: email,
    role: 'customer', // account role for registration
  });
};
