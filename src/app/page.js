'use client'
import React from 'react';
import './page.module.css';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  router.push('/');
  
  return (
    <>
      <div className='homepage-background'>
        <h1>HomePage or Landing Page</h1>
      </div>
      <main>
        <p>          
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla venenatis fermentum ipsum. Duis laoreet est est, venenatis ullamcorper sem accumsan eu. Donec laoreet erat sapien, et efficitur nulla facilisis in. Maecenas vel augue orci. Mauris eu ex porttitor, venenatis lorem et, efficitur justo. Cras consectetur a lorem vel lobortis. Fusce euismod tortor facilisis, tristique elit vel, commodo risus. In in purus lectus. Suspendisse vitae elit fringilla, laoreet arcu ac, porttitor diam. Integer velit nulla, dapibus at vulputate et, bibendum a odio. Sed consectetur faucibus tortor sit amet rutrum. In vel orci bibendum, hendrerit leo at, aliquam ante. Nam sed metus euismod, dignissim justo at, rutrum libero. Nunc vitae elit purus.
        </p>
      </main>
    </>
  );
}

export default HomePage;
