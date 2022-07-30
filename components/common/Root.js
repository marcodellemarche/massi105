import React from 'react';
import Header from './Header';

export default function Root({ transparentHeader = false, children }) {
  return (
    <>
      <Header transparent={transparentHeader} />
      {children}
    </>
  );
}
