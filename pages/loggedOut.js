import React from 'react';
import Root from '../components/common/Root';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/common/Footer';
import siteConfig from '../utils/siteConfig';
import { useTranslation } from 'react-i18next';

const LoggedOut = () => {
  const {t} = useTranslation();

  return (
    <Root>
      <Head>
        <title>{siteConfig.title}</title>
      </Head>
      <div className="account-container">
        <div className="custom-container py-5 my-4 my-sm-5">
          <div className="row mt-4">
            <div className="col-12 text-center">
              <h2 className="font-size-header mb-4 pt-5">
                {t('logout.successful')}
              </h2>
              <Link href="/" className="mt-4">
                <a>
                  {t('logout.next')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Root>
  );
};

export default LoggedOut;
