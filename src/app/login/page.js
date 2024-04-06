"use client";
import { useRouter } from "next/navigation";

export default function SignInRoleSelection() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-56 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
            alt="Sign In"
          />
        </div>
        <div
          className="flex flex-1 flex-col justify-center p-6"
          style={{ backgroundColor: "#5b9c7a" }}
        >
          <div className="mx-auto w-full max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-2xl font-extrabold text-white">
              Sign in to your account
            </h2>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => router.push("/login/user")}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Customer Sign in
              </button>
              <button
                onClick={() => router.push("/login/driver")}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Driver Sign in
              </button>
              <button
                onClick={() => router.push("/login/admin")}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Admin Sign in
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white">
            Not a member?{" "}
            <a
              onClick={() => router.push("/register")}
              className="cursor-pointer font-bold text-indigo-500 hover:text-indigo-700"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
