'use client'
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen">
       <div className="max-w-xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-56 flex-shrink-auto rounded-lg">
          <img
            className="w-full h-full object-cover"
            src="https://blog.ecabrella.com/hs-fs/hubfs/AdobeStock_299668592.jpeg?width=5569&name=AdobeStock_299668592.jpeg"
            alt="Your Image"
          />
          </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm overflow-hidden bg-white shadow-lg p-6" style={{backgroundColor: '#5b9c7a'} }>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=%345454"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-4 tracking-tight text-white">
              Create an Account
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">
              <div></div>
              <div>
                <button
                  onClick={() => router.push('register/user')} //redirect to admin-dashboard
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
                >
                  Customer Sign up
                </button>
              </div>
              <div>
                <button
                  onClick={() => router.push('register/admin')} //redirect to admin-dashboard
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
                >
                  Register Business
                </button>
              </div>
            </div>
          </div>
    
          <p className="mt-10 text-center text-sm" style={{color: "#a4d7bb"}}>
            Already a member?{' '}
            <button onClick={() => router.push('login')} className="font-bold leading-6 text-indigo-400 hover:text-indigo-300" style={{color: "#345454"}}>
              Sign In
            </button>
          </p>
        </div>
      </div>
      </div>
  );
}
