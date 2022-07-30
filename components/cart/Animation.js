import React from 'react';
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('react-lottie'));
import animationData from '../../lotties/add-to-cart.json';

export default function Animation( props ) {
  return (
    <div className="cart-animation">
      <Lottie
        options={{
          loop: false,
          autoplay: false,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={32}
        width={32}
        isStopped={!props.isStopped}
        // style={{
        //   transform: 'scale(5)',
        // }}
      />
    </div>
  );
}
