import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('react-lottie'));
import animationData from '../../lotties/login.json';

export default function LoginAnimation() {
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
    <div className="login-animation pt-20">
      <Lottie
        options={defaultOptions}
        height={175}
        width={200}
      />
      <h2 className="login-animation__title text-center font-family-secondary">
        {t('login.loggingIn')}
      </h2>
    </div>
  );
}
