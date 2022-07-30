import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import siteConfig from '../../utils/siteConfig.js';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="pt-5">
      <div className="custom-container pb-5 pt-5">
        <div className="row">
          <div className="col-12 font-color-medium text-center">
            <p>
              {/* {siteConfig.legalName} - P. IVA {siteConfig.pIva} - {t('footer.warning')} */}
              {siteConfig.legalName} - P. IVA {siteConfig.pIva}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="custom-container pb-5 pt-5">
        <div className="row">
          <div className="col-12 col-sm-6 col-md-4">
            <p className="font-family-secondary font-size-display1 mb-4">
              Commerce.js
            </p>
            <div className="d-flex font-color-medium mb-5 pb-3 pb-md-0 mb-md-0">
              <div className="pr-5">
                <a
                  href="https://commercejs.com/docs/"
                  className="mb-3 d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
                <a
                  href="https://commercejs.com/features"
                  className="d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Features
                </a>
              </div>
              <div>
                <a
                  href="https://commercejs.com/about"
                  className="mb-3 d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </a>
                <a
                  href="http://slack.commercejs.com/"
                  className="d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Community
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <p className="font-family-secondary font-size-display1 mb-4">
              Follow us
            </p>
            <div className="d-flex font-color-medium mb-5 pb-3 pb-md-0 mb-md-0">
              <div className="pr-5">
                <a
                  href="https://twitter.com/commercejs"
                  className="mb-3 d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a
                  href="https://www.instagram.com/commerce.js/"
                  className="d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
              <div>
                <a
                  href="https://angel.co/company/chec"
                  className="mb-3 d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Angel
                </a>
                <a
                  href="https://www.linkedin.com/company/chec-chec-commerce-inc.-/"
                  className="d-block font-color-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <p className="font-family-secondary font-size-display1 mb-3">
              Newsletter
            </p>
            <div className="position-relative">
              <input
                className="borderbottom border-color-gray400 h-48 w-100 px-3"
                placeholder="email address"
              />
              <button className="bg-transparent position-absolute right-0 top-50 translateY--50 pr-2 h-48">
                <svg className="fill-black w-24 h-24">
                  <title>Submit email</title>
                  <use xlinkHref="/icons.svg#arrow-long-right"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-md-5">
        <div className="bg-brand300">
          <div className="custom-container d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="pt-5 pb-0 pt-md-4 pb-md-4 d-flex align-items-center flex-wrap justify-content-center">
              <a
                href="https://app.netlify.com/start/deploy?repository=https://github.com/chec/commercejs-nextjs-demo-store"
                className="font-color-brand font-size-caption text-uppercase text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy to Netlify
              </a>
              <p className="px-2 font-color-brand font-size-caption">-</p>
              <a
                href="https://github.com/chec/commercejs-nextjs-demo-store"
                className="font-color-brand font-size-caption text-uppercase text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clone in GitHub
              </a>
              <p className="px-2 font-color-brand font-size-caption">-</p>
              <a
                href="https://github.com/chec/commercejs-nextjs-demo-store"
                className="font-color-brand font-size-caption text-uppercase text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute
              </a>
            </div>
            <div className="font-color-brand font-size-caption py-4 text-right">
            <a
                href="https://commercejs.com/"
                className="font-color-brand font-size-caption text-uppercase text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                &copy; { new Date().getFullYear() } Chec/Commerce.js.
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  )
};

export default Footer;
