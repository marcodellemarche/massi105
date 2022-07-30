import ccFormat from './ccFormat.js';

export const devCheckoutState = {
    selectedBillingOption: 'same',

    // string property names to conveniently identify inputs related to commerce.js validation errors
    // e.g error { param: "shipping[name]"}
    'customer[first_name]': 'Marco',
    'customer[last_name]': 'Ferretti',
    'customer[email]': 'mferretti93@gmail.com',
    'customer[phone]': '',
    'customer[id]': null,
    'shipping[name]': 'Marco Ferretti',
    'shipping[street]': 'Via Vai 33',
    'shipping[street_2]': '',
    'shipping[town_city]': 'Fabriano',
    'shipping[region]': 'IT-AN',
    'shipping[postal_zip_code]': '60044',
    'shipping[country]': 'IT',
    'billing[name]': '',
    'billing[street]': '',
    'billing[street_2]': '',
    'billing[town_city]': '',
    'billing[region]': '',
    'billing[postal_zip_code]': '',
    'billing[country]': '',
    receiveNewsletter: true,
    orderNotes: '',
    countries: {},

    'fulfillment[shipping_method]': '',
    cardNumber: ccFormat('4242424242424242'),
    expMonth: '11',
    expYear: '22',
    cvc: '123',
    billingPostalZipcode: 'V6B 2V2',

    errors: {
      'fulfillment[shipping_method]': null,
      gateway_error: null,
      'customer[email]': null,
      'shipping[name]': null,
      'shipping[street]': null,
      'shipping[town_city]': null,
      'shipping[postal_zip_code]': null
    },

    discountCode: 'CUSTOMCOMMERCE',

    selectedGateway: 'test_gateway',
    loading: false,
    paypalLoading: false,
    // Optional if using Stripe, used to track steps of checkout using Stripe.js
    stripe: {
      paymentMethodId: null,
      paymentIntentId: null,
    },
};
