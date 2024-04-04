import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth/next";
import { auth }  from "/src/firebase/firebase";

export const authOptions = {
    pages: {
        AdminSignIn: '/login/admin',
        UserSignIn: '/login/user',
        DriverSignIn: '/login/driver'
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {},
          async authorize(credentials, req) {
            return await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then(userCredential => {
                if (userCredential.user) {
                    return userCredential.user;
                }
                return null;
            })
            .catch(error => console.log(error));
        }
        })
    ]
}
export default NextAuth(authOptions)

