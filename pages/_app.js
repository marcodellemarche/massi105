/* global process */
import React, {useEffect, useState} from 'react';
import '../style/scss/style.scss';
import { useStore } from '../store';
import { Provider  } from 'react-redux';
import commerce from '../lib/commerce';
import { loadStripe } from '@stripe/stripe-js';
import { setCustomer } from '../store/actions/authenticateActions';
import '../locales/i18n';
import Script from 'next/script';

const MyApp = ({Component, pageProps}) => {

  const store = useStore(pageProps.initialState);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) { // has API key
      setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
    }

    store.dispatch(setCustomer());
    
    const { products, categories } = pageProps;

    if (!products) {
      commerce.products.list().then((res) => {
        store.dispatch({
          type: 'STORE_PRODUCTS',
          payload: res.data
        })
      });
    } else {
      store.dispatch({
        type: 'STORE_PRODUCTS',
        payload: products
      })
    }

    if (!categories) {
      commerce.categories.list().then((res) => {
        store.dispatch({
          type: 'STORE_CATEGORIES',
          payload: res.data
        })
      });
    } else {
      store.dispatch({
        type: 'STORE_CATEGORIES',
        payload: categories
      })
    }

  }, [pageProps, store])

  return (
    <>
      <Script
        id="svg4everybody"
        src="https://jonneal.dev/svg4everybody/svg4everybody.min.js"
        onLoad={() => {
          // @ts-ignore
          svg4everybody();
        }}
        onError={(error) => {
          console.error('Script svg4everybody failed to load', error);
        }}
      />
      <Provider store={store}>
        <Component
          {...pageProps}
          stripe={stripePromise}
        />
      </Provider>
    </>
  );

}

export default MyApp;
