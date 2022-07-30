import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('react-lottie'));
import animationData from '../../lotties/checkout.json';

export default function Loader() {
  const { t } = useTranslation();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  };

  return (
    <div className="loader-animation">
      <Lottie
        options={defaultOptions}
        height={500}
        width={400}
      />
      <h1 className="text-center font-family-secondary">
        {t('checkout.processingOrder')}
      </h1>
    </div>
  );
}
