import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next';
import siteConfig from '../../utils/siteConfig.js';

const OrderConfirm = dynamic(() => import('../../components/checkout/Confirm'),
  { ssr: false }
)

function Confirm() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('routes.orderReceipt')} | {siteConfig.title}</title>
      </Head>
      <OrderConfirm />
    </>
  )
}

export default Confirm;
