import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import Home1 from '../../public/images/home-1.jpg'
// @ts-ignore
import Home2 from '../../public/images/home-2.jpg'
// @ts-ignore
import Home3 from '../../public/images/home-3.jpg'
// @ts-ignore
import Home4 from '../../public/images/home-4.jpg'

const params = {
  slidesPerView: 1,
  watchOverflow: false,
  autoplay: {
    delay: 5000
  },
  loop: true,
  allowTouchMove: false,
  speed: 1000,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  }
};
// const images = [
//   '/images/home-1.jpg',
//   '/images/home-2.jpg',
//   '/images/home-3.jpg',
//   '/images/home-4.jpg',
// ];
const images = [
  Home1,
  Home2,
  Home3,
  Home4,
];

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="hero-section position-relative d-flex align-items-center justify-content-center flex-column font-color-white py-5">
      <Image
        src={Home1}
        alt="Hero image"
        className="hero-img"
        layout="fill"
        objectFit="cover"
        // placeholder="blur"
        priority
      />
      <h1 className="font-size-display5 font-family-secondary mb-4 mt-5 mx-1 text-center hero-header">
        {t('hero.title')}
      </h1>
      <h2 className="text-transform-uppercase font-size-title mb-5 mx-3 text-center hero-subheader">
        {t('hero.subtitle')}
      </h2>
      <Link href="/collection">
        <a className="d-flex align-items-center bg-brand700 border border-color-white h-56 px-5 mx-1 font-color-white hero-btn font-size-title">
          {t('hero.cta')}
        </a>
      </Link>
    </div>
  );
}
