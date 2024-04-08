"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function UserSignin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid.slice(0, 5);

      router.push(`/user/${uid}/dashboard`);
    } catch (error) {
      console.error("Error signing in:", error);
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("No user found with this email. Please sign up.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        default:
          setErrorMessage("Failed to sign in. Please try again.");
          break;
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div
          className="max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex"
          style={{ backgroundColor: "#5b9c7a" }}
        >
          <div className="w-56 flex-shrink-auto rounded-lg">
            <img
              className="w-full h-full object-cover"
              src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
              alt="Your Image"
            />
          </div>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-sm text-red-500">
                    {errorMessage}
                    {errorMessage.includes("No user found") && (
                      <button
                        onClick={() => router.push("../register/user")}
                        className="ml-1 text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Sign up
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            <p className="mt-2 text-center text-sm text-gray-600">
              Not a member?{" "}
              <a
                href="#"
                onClick={() => router.push("../register/user")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
