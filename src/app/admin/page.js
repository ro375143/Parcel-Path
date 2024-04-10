'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div style={{padding: '20px', margin: '20px'}}
    >
      <div className='homepage-background'>
        <h1 style={{marginBottom: '20px', fontSize: '2rem'}}
        >DASHBOARD</h1>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}
      >
        <button 
          onClick={() => router.push('/admin/1/feedback')}
          className='flex w-full justify-center rounded-md px-4 py-2 text-sm shadow-lg font-semibold leading-6 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2'
          style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
          >
            View Feedback Queue
        </button>
      </div>
      <div>
        <button 
          onClick={() => router.push('/admin/1/package-grid')}
          className='flex w-full justify-center rounded-md px-4 py-2 text-sm shadow-lg font-semibold leading-6 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2'
          style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
          >
            View Package Grid
        </button>
      </div>
      <div>
        <button
        onClick={() => router.push('/admin/1/package-grid')}
        className='flex w-full justify-center rounded-md px-4 py-2 text-sm shadow-lg font-semibold leading-6 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2'
        style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
        >
          All Time Package Grid
        </button>
      </div>
      <div>
        <button
        onClick={() => router.push('/admin/1/package-grid')}
        className='flex w-full justify-center rounded-md px-4 py-2 text-sm shadow-lg font-semibold leading-6 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2'
        style={{backgroundColor: '#345454', transition: 'background-color 0.3s' }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#a4d7bb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#345454'}
        >
          Update Package Information
        </button>
      </div>
    </div>
    

    
  );

}

export default AdminDashboard;