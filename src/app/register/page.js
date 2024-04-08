"use client";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-56 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
            alt="Registration"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-6 bg-[#5b9c7a]">
          <div className="mx-auto w-full max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create an Account
            </h2>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => router.push("/register/user")}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Customer Sign up
              </button>
              <button
                onClick={() => router.push("/register/admin")}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register Business
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white">
            Already a member?{" "}
            <a
              onClick={() => router.push("/login")}
              className="cursor-pointer font-bold text-indigo-500 hover:text-indigo-700"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
