import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth/next";
import { auth }  from "@/firebase";

export const authOptions = {
    pages: {
        signIn: '/signIn'
    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
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

