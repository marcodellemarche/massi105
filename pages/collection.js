import React from 'react';
import Head from 'next/head';
import Root from '../components/common/Root';
// import ExploreBanner from '../components/productAssets/ExploreBanner';
import Collections from '../components/collections/Collections';
// import SocialMedia from '../components/common/SocialMedia';
import Footer from '../components/common/Footer';
import { useTranslation } from 'react-i18next';
import siteConfig from '../utils/siteConfig.js';
import commerce from '../lib/commerce.js';

const Home = () => {
  const {t} = useTranslation();

  return (
    <Root>
      <Head>
        <title>{t('routes.shop')} | {siteConfig.title}</title>
      </Head>
      <Collections />
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
