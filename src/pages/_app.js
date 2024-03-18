import React from 'react';
import '../globals.css';
import 'antd/dist/antd.css';
import RootLayout from '../app/layout'; 

function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
