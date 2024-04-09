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
              <div className="flex justify-center">
                <div
                  style={{ width: "300px", height: "90px", overflow: "hidden" }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "120%",
                      objectFit: "cover",
                    }}
                    src="https://media.discordapp.net/attachments/1197323344937234464/1225573887639814289/parcel_path_7.png?ex=66219fa0&is=660f2aa0&hm=45169aea1948b7dc2d1feb88e3fd3bd659c090f1d51ff8b11afe9521f84fe9f7&=&format=webp&quality=lossless"
                    alt="Your Company"
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div
                  className="inline-block rounded-lg px-4 py-2 shadow-2xl"
                  style={{ backgroundColor: "#345454" }}
                >
                  <h2 className="text-2xl font-bold leading-1 tracking-tight text-white">
                    Customer Login
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
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
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <div
                        onClick={() => router.push("/forgot-password")}
                        className="cursor-pointer font-bold text-indigo-400 hover:text-indigo-300"
                        style={{ color: "#345454" }}
                      >
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
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="text-sm text-red-500 font-bold">
                    {errorMessage}
                    {errorMessage.includes("No user found") && (
                      <button onClick={() => router.push("../register/admin")}>
                        Sign up
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={!email || !password}
                    className="disabled:opacity-40 flex w-full shadow-2xl justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      backgroundColor: "#345454",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#a4d7bb")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#345454")
                    }
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            <p
              className="mt-4 text-center text-sm text-gray-400"
              style={{ color: "#a4d7bb" }}
            >
              Not a member?{" "}
              <a
                href="#"
                onClick={() => router.push("../register/user")}
                className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 "
                style={{ color: "#345454" }}
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
