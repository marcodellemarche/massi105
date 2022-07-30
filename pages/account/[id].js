import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useSelector } from 'react-redux'
import moment from 'moment';
import commerce from '../../lib/commerce';
import Root from '../../components/common/Root';
import Footer from '../../components/common/Footer';
import TemplatePage from '../../components/common/TemplatePage';
import LoggedOut from '../loggedOut';
import { useTranslation } from 'react-i18next';
import siteConfig from '../../utils/siteConfig.js';
import Image from 'next/image';
import { useMobile } from '../../lib/useMobile.js';

export default function SingleOrderPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, customerLoading] = useSelector((state) => [
    state.customer,
    state.loading.customer,
  ]);
  const isMobile = useMobile();

  /**
   * Verify the user is logged in, if not send them back to home. Only runs when in the
   * browser.
   */
  const verifyAuth = () => {
    if (typeof window !== 'undefined' && !commerce.customer.isLoggedIn()) {
      return Router.push('/');
    }
  };
  verifyAuth();

  useEffect(() => {
    if (!customer) {
      return;
    }

    const fetchOrderById = async (id) => {
      try {
        const order = await commerce.customer.getOrder(id, customer.id);

        setLoading(false);
        setData(order);
      } catch (err) {
        setLoading(false);
        setError(err?.message);
      }
    };

    fetchOrderById(id);
  }, [id, customer]);

  /**
   * Create order date if available
   */
  const OrderDate = ({ date: data }) => {
    if (!data) {
      return null;
    }

    const date = moment.unix(data);

    if (!date.isValid()) {
      return null
    }
    return (
      <small><strong>
        {t('order.placedOn')}:
      </strong> { moment(date).format('DD/MM/YYYY') }</small>
    )
  };

  /**
   * Create thumbnail if available
   */
  const ImageThumb = ({ image: data }) => {
    if (!data.media) {
      return null;
    }

    return (
      <Image
        alt={data.product_name} 
        className="img-thumbnail h-72 mr-4"
        src={data.media.source}
        width={72}
        height={72}
      />
    )
  };

  /**
   * Create the billing card
   */
  const BillingAddress = ({ address: data }) => {
    if (data.length === 0) {
      return null;
    }

    return (
      <div>
        <h5>
          {t('order.billingAddress')}
        </h5>
        <div className="card p-2 mb-4">
          <div>
            <div><strong>{ data.name }</strong></div>
            <div>{ data.street }</div>
            { data.street_2 && <div>{ data.street_2 }</div> }
            <div>{ data.town_city}{(data.town_city && data.county_state) ? ',':'' } { data.county_state }</div>
            <div>{ data.country}{(data.town_city && data.county_state) ? ',':'' } { data.postal_zip_code }</div>
          </div>
        </div>
      </div>
    )
  };

  /**
   * Create the shipping card
   */
  const ShippingAddress = ({ address: data }) => {
    if (data.length === 0) {
      return null;
    }

    return (
      <div>
        <h5>
          {t('order.shippingAddress')}
        </h5>
        <div className="card p-2">
          <div>
            <div><strong>{ data.name }</strong></div>
            <div>{ data.street }</div>
            { data.street_2 && <div>{ data.street_2 }</div> }
            <div>{ data.town_city}{(data.town_city && data.county_state) ? ',':'' }  { data.county_state }</div>
            <div>{ data.country}{(data.town_city && data.county_state) ? ',':'' }  { data.postal_zip_code }</div>
          </div>
        </div>
      </div>
    )
  };

  /**
   * Render loading state
   */
  if (customerLoading) {
    return <TemplatePage page={  { message: t('common.loading') }  } />
  }

  /**
   * Render logged out message if no customer is available
   */
  if (!customer) {
    return <LoggedOut />;
  }

  /**
   * Render a page if an error occurred
   */
  if (error) {
    return <TemplatePage page={ {message: t('error.generic')} } />
  }

  /**
   * Render loading state
   */
  if (loading) {
    return <TemplatePage page={ {message: t('common.loading')} } />
  }

  /**
   * Render a page if no order found
   */
  if (!data) {
    return <TemplatePage page={ {message: t('error.orderNotFound')} } />
  }

  /**
   * If no errors, return the order page.
   */
  return (
    <Root>
      <Head>
        <title>
          {t('routes.account')} | {t('routes.order')} { data.customer_reference } | { siteConfig.title }
        </title>
      </Head>
      <div className="account-container">
          <div className="custom-container py-5 my-4 my-sm-5">
            <div className="row mt-4">
              <div className="col-12">
                {/* Breadcrumbs */}
                <div className="d-flex pb-4 breadcrumb-container">
                  <Link href="/account">
                    <a className="font-size-caption text-decoration-underline cursor-pointer font-color-black">
                      {t('routes.account')}
                    </a>
                  </Link>
                  <svg className="fill-black w-16 h-16 mx-1">
                    <title>Breadcrumb arrow</title>
                    <use xlinkHref="/icons.svg#arrow-right"></use>
                  </svg>
                  <div className="font-size-caption font-weight-bold cursor-pointer">
                  { data.customer_reference }
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row mt-2 pt-2">
              <div className="col-12">
                <h2 className="font-size-header mb-4 pt-5 text-center">
                  {t('order.order')}: #{ data.customer_reference }
                </h2>
              </div>
            </div> */}
            <div className="row mt-3 pt-3">
              <div className="col-12 col-md-8 col-lg-8">
                <div className="d-flex flex-row justify-content-between">
                  <h5>
                    {t('order.items')}
                  </h5>
                  <OrderDate date={data.created}/>
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>
                        {t('order.product')}
                      </th>
                      {!isMobile && (
                        <th>
                          {t('order.price')}
                        </th>
                      )}
                      <th>
                        {isMobile ? '#' : t('order.quantity')}
                      </th>
                      <th>
                        {t('order.total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    { data.order.line_items.map((item) => {
                      return (
                        <tr key={ item.id }>
                          <td>
                            <ImageThumb image={item}/>
                            { item.product_name }
                          </td>
                          {!isMobile && (
                            <td>{ item.price.formatted_with_code }</td>
                          )}
                          <td>{ item.quantity }</td>
                          <td>{ item.line_total.formatted_with_code }</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={isMobile ? 1 : 2} className="border-right-0">
                        {t('order.subtotal')}
                      </td>
                      <td colSpan={2} className="border-left-0 text-right">
                        { data.order.subtotal.formatted_with_code}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={isMobile ? 1 : 2} className="border-right-0">
                        {t('order.shipping')}
                      </td>
                      <td colSpan={2} className="border-left-0 text-right">
                        { data.order.shipping.price.formatted_with_code}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={isMobile ? 1 : 2} className="border-right-0">
                        {t('order.taxes')}
                      </td>
                      <td colSpan={2} className="border-left-0 text-right">
                        { data.order.tax.amount.formatted_with_code}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={isMobile ? 1 : 2} className="border-right-0">
                        <strong>
                          {t('order.total')}
                        </strong>
                      </td>
                      <td colSpan={2} className="border-left-0 text-right">
                        <strong>
                          { data.order.total.formatted_with_code}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="col-12 col-md-4 col-lg-4 row-content">
                <BillingAddress address={data.billing} />
                <ShippingAddress address={data.shipping} />
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </Root>
  );
}
