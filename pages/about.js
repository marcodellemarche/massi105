import React from 'react';
import Head from 'next/head';
import Root from '../components/common/Root';
import Footer from '../components/common/Footer';
import { useTranslation } from 'react-i18next';
import siteConfig from '../utils/siteConfig.js';
import Image from 'next/image';
// @ts-ignore
import About1 from '../public/images/home-2.jpg'
// @ts-ignore
import About2 from '../public/images/home-3.jpg'

const About = () => {
  const {t} = useTranslation();

  return (
    <Root>
      <Head>
        <title>{t('routes.about')} | {siteConfig.title}</title>
      </Head>
      <div className="about-container">
        {/* Row 1 */}
        <div className="row mt-5 pt-5">
          <div className="col-12 col-md-10 col-lg-6 offset-md-1 offset-lg-0 row-content">
            <div className="h-100 d-flex flex-column py-5 px-4 px-sm-5 justify-content-center">
              <h2 className="font-size-header mb-4">
                {t('about.title')}
              </h2>
              <h4 className="font-size-subheader mb-4" dangerouslySetInnerHTML={{
                __html: t('about.text')
              }}>
              </h4>
            </div>
          </div>
  
          <div className="col-12 col-lg-6">
            <div className="about-image h-100">
              <div className="d-flex align-items-center justify-content-center h-100">
                <Image
                  src={About1}
                  alt="About us image"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Row 2 */}
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="about-image h-100">
              <div className="d-flex align-items-center justify-content-center h-100">
                <Image
                  src={About2}
                  alt="About us image"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
  
          <div className="col-12 col-md-10 col-lg-6 offset-md-1 offset-lg-0 row-content">
            <div className="h-100 d-flex flex-column justify-content-center py-5 px-4 px-sm-5">
              <h3 className="font-size-header mb-4">
                {t('about.secondTitle')}
              </h3>
              <h4 className="font-size-subheader mb-4" dangerouslySetInnerHTML={{
                  __html: t('shop.shippingDetails', { hours: siteConfig.shippingHours })
                }}>
              </h4>
              <h4 className="font-size-subheader mb-4" dangerouslySetInnerHTML={{
                  __html: t('shop.receiptDetails')
                }}>
              </h4>
              <h4 className="font-size-subheader mb-4" dangerouslySetInnerHTML={{
                  __html: t('shop.assistenceDetails')
                }}>
              </h4>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="row">
          <div className="col-12 col-md-10 col-lg-12 offset-md-1 offset-lg-0 row-content">
            <div className="h-100 d-flex flex-column justify-content-center py-5 px-4 px-sm-5">
              <h3 className="font-size-header mb-4">
                {t('about.contacts.title')}
              </h3>
              <h4 className="font-size-subheader mb-4">
                {t('about.contacts.text')}
              </h4>
              <h4 className="font-size-subheader mb-4">
                <p>
                  <label className="mr-2">
                    {t('about.contacts.phoneNumber')}:
                  </label>
                  <a
                    href={`tel:${siteConfig.phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteConfig.phoneNumber}
                  </a>
                </p>
                <p>
                  <label className="mr-2">
                    {t('about.contacts.whatsappNumber')}:
                  </label>
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteConfig.whatsappNumber}
                  </a>
                </p>
                <p>
                  <label className="mr-2">
                    {t('about.contacts.emailAddress')}:
                  </label>
                  <a
                    href={`mailto:${siteConfig.emailAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteConfig.emailAddress}
                  </a>
                </p>
              </h4>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </Root>
  );
};

export default About;
