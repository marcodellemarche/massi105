import React from 'react';
import Head from 'next/head';
import Root from '../components/common/Root';
import Footer from '../components/common/Footer';
import SocialMedia from '../components/common/SocialMedia';
import ExploreBanner from '../components/productAssets/ExploreBanner';
import HeroSection from '../components/homepage/HeroSection';
import HomeBanner from '../components/homepage/HomeBanner';
import CategoryBanner from '../components/homepage/CategoryBanner';
import ProductsBanner from '../components/homepage/ProductsBanner';
import siteConfig from '../utils/siteConfig';
import { useTranslation } from 'react-i18next';
import commerce from '../lib/commerce.js';

const Home = () => {
  const {t} = useTranslation();

  return (
    <Root transparentHeader={false}>
      <Head>
        <title>{t('routes.home')} | {siteConfig.title}</title>
      </Head>
  
      <HeroSection />
      {/* <HomeBanner /> */}
      {/* <CategoryBanner /> */}
      <ProductsBanner />
      {/* <ExploreBanner /> */}
      {/* <SocialMedia /> */}
      <Footer />
    </Root>
  );
};

export default Home;

export async function getStaticProps() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    commerce.products.list(),
    commerce.categories.list(),
  ]);

  return { props: { products, categories } }
}
