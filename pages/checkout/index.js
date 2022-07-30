import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import ccFormat from '../../utils/ccFormat';
import commerce from '../../lib/commerce';
import Checkbox from '../../components/common/atoms/Checkbox';
import Dropdown from '../../components/common/atoms/Dropdown';
import Radiobox from '../../components/common/atoms/Radiobox';
import Root from '../../components/common/Root';
import AddressForm from '../../components/checkout/common/AddressForm';
import PaymentDetails from '../../components/checkout/common/PaymentDetails';
import Loader from '../../components/checkout/Loader';
import {
  generateCheckoutTokenFromCart as dispatchGenerateCheckout,
  getShippingOptionsForCheckout as dispatchGetShippingOptions,
  setShippingOptionInCheckout as dispatchSetShippingOptionsInCheckout,
  setDiscountCodeInCheckout as dispatchSetDiscountCodeInCheckout,
  captureOrder as dispatchCaptureOrder,
} from '../../store/actions/checkoutActions';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { CardElement, Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { withTranslation } from 'react-i18next';
import siteConfig from '../../utils/siteConfig.js';
import Image from 'next/image';
import { devCheckoutState } from '../../utils/devConfig.js';

// const billingOptions ['Same as shipping Address', 'Use a different billing address'];

/**
 * Render the checkout page
 */
class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = process.env.NODE_ENV === 'development' ? devCheckoutState : {
      selectedBillingOption: 'same',

      // string property names to conveniently identify inputs related to commerce.js validation errors
      // e.g error { param: "shipping[name]"}
      'customer[first_name]': '',
      'customer[last_name]': '',
      'customer[email]': '',
      'customer[phone]': '',
      'customer[id]': null,
      'shipping[name]': '',
      'shipping[street]': '',
      'shipping[street_2]': '',
      'shipping[town_city]': '',
      'shipping[region]': '',
      'shipping[postal_zip_code]': '',
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
      cardNumber: ccFormat(''),
      expMonth: '',
      expYear: '',
      cvc: '',
      billingPostalZipcode: '',

      errors: {
        'fulfillment[shipping_method]': null,
        gateway_error: null,
        'customer[email]': null,
        'shipping[name]': null,
        'shipping[street]': null,
        'shipping[town_city]': null,
        'shipping[postal_zip_code]': null
      },

      discountCode: '',

      selectedGateway: '',
      loading: false,
      paypalLoading: false,
      // Optional if using Stripe, used to track steps of checkout using Stripe.js
      stripe: {
        paymentMethodId: null,
        paymentIntentId: null,
      },
    };

    this.captureOrder = this.captureOrder.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.toggleNewsletter = this.toggleNewsletter.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleDiscountChange = this.handleDiscountChange.bind(this);
    this.handleGatewayChange = this.handleGatewayChange.bind(this);
    this.handleCaptureSuccess = this.handleCaptureSuccess.bind(this);
    this.handleCaptureError = this.handleCaptureError.bind(this);
    this.redirectOutOfCheckout = this.redirectOutOfCheckout.bind(this);
    this.getPaypalPaymentId = this.getPaypalPaymentId.bind(this);
    this.renderPaypalButton = this.renderPaypalButton.bind(this);
    this.capturePaypalOrder = this.capturePaypalOrder.bind(this);
    this.getStripePaymentMethod = this.getStripePaymentMethod.bind(this);
  }

  componentDidMount() {
    // if cart is empty then redirect out of checkout;
    if (this.props.cart && this.props.cart.total_items === 0) {
      this.redirectOutOfCheckout();
    }

    this.updateCustomerFromRedux();
    // on initial mount generate checkout token object from the cart,
    // and then subsequently below in componentDidUpdate if the props.cart.total_items has changed
    this.generateToken();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cart && this.props.cart.total_items === 0 && !this.props.orderReceipt) {
      this.redirectOutOfCheckout();
    }

    // if cart items have changed then regenerate checkout token object to reflect changes.
    if (prevProps.cart && prevProps.cart.total_items !== this.props.cart.total_items && !this.props.orderReceipt) {
      // reset selected shipping option
      this.setState({
        'fulfillment[shipping_method]': '',
      })
      // regenerate checkout token object since cart has been updated
      this.generateToken();
    }

    if (this.props.customer && !prevProps.customer) {
      this.updateCustomerFromRedux();
    }

    const hasDeliveryCountryChanged = prevState['shipping[country]'] !== this.state['shipping[country]'];
    const hasDeliveryRegionChanged = prevState['shipping[region]'] !== this.state['shipping[region]'];

    // if delivery country or region have changed, and we still have a checkout token object, then refresh the token,
    // and reset the previously selected shipping method
    if ((hasDeliveryCountryChanged || hasDeliveryRegionChanged) && this.props.checkout) {
      // reset selected shipping option since previous checkout token live object shipping info
      // was set based off delivery country, deliveryRegion
      this.setState({
        'fulfillment[shipping_method]': '',
      })
      this.generateToken();
    }

    // if selected shippiing option changes, regenerate checkout token object to reflect changes
    if (
      prevState['fulfillment[shipping_method]'] !== this.state['fulfillment[shipping_method]']
      && this.state['fulfillment[shipping_method]'] && this.props.checkout
    ) {
      // update checkout token object with shipping information
      this.props.dispatchSetShippingOptionsInCheckout(
        this.props.checkout.id,
        this.state['fulfillment[shipping_method]'],
        this.state['shipping[country]'],
        this.state['shipping[region]']
      );
    }
  }

  /**
   * Uses the customer provided by redux and updates local state with customer detail (if present)
   */
  updateCustomerFromRedux() {
    // Pull the customer object from prop (provided by redux)
    const { customer } = this.props;

    // Exit early if the customer doesn't exist
    if (!customer) {
      return;
    }

    // Build a some new state to use with "setState" below
    const newState = {
      'customer[email]': customer.email,
      'customer[id]': customer.id,
    };

    if (customer.firstname) {
      newState['customer[first_name]'] = customer.firstname;
      newState['shipping[name]'] = customer.firstname;
      newState['billing[name]'] = customer.firstname;
    }

    if (customer.lastname) {
      newState['customer[last_name]'] = customer.lastname;

      // Fill in the rest of the full name for shipping/billing if the first name was also available
      if (customer.firstname) {
        newState['shipping[name]'] += ` ${customer.lastname}`;
        newState['billing[name]'] += ` ${customer.lastname}`;
      }
    }

    this.setState(newState);
  }

  /**
   * Generate a checkout token. This is called when the checkout first loads.
   */
  generateToken() {
    const { cart, dispatchGenerateCheckout, dispatchGetShippingOptions } = this.props;
    const { 'shipping[country]': country, 'shipping[region]': region } = this.state;

    // Wait for a future update when a cart ID exists
    if (typeof cart.id === 'undefined') {
      return;
    }

    return dispatchGenerateCheckout(cart.id)
      .then((checkout) => {
        // continue and dispatch getShippingOptionsForCheckout to get shipping options based on checkout.id
        getAllCountries(checkout).then(countries => this.setState({ countries }));

        return dispatchGetShippingOptions(checkout.id, country, region)
          .then(shippingOptions => {
            if (shippingOptions.length) {
              this.setState({
                'fulfillment[shipping_method]': shippingOptions[0].id,
              });
            }
          });
      })
      .catch(error => {
        console.log('error caught in checkout/index.js in generateToken', error);
      })
  }

  redirectOutOfCheckout() {
    this.props.router.push('/');
  }

  handleGatewayChange(selectedGateway) {
    this.setState({
      selectedGateway,
    });
  }

  handleDiscountChange(e) {
    e.preventDefault();
    if (!this.state.discountCode.trim() || !this.props.checkout) {
      return;
    }
    
    const { t } = this.props;

    this.props.dispatchSetDiscountCodeInCheckout(this.props.checkout.id, this.state.discountCode)
      .then(resp => {
        if (resp.valid) {
          return this.setState({
            discountCode: '',
          });
        }
        return Promise.reject(resp);
      })
      .catch(error => {
        alert(t('error.discountNotApplicable'));
      });
  }

  handleChangeForm(e) {
    // when input cardNumber changes format using ccFormat helper
    if (e.target.name === 'cardNumber') {
      e.target.value = ccFormat(e.target.value)
    }
    // update form's input by name in state
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Handle a successful `checkout.capture()` request
   *
   * @param {object} result
   */
  handleCaptureSuccess(result) {
    this.props.router.push('/checkout/confirm');
  };

  /**
   * Handle an error during a `checkout.capture()` request
   *
   * @param {object} result
   */
  handleCaptureError(result) {
    console.log('handleCaptureError')
    // Clear the initial loading state
    this.setState({ loading: false });

    let errorToAlert = '';

    // If errors are passed as strings, output them immediately
    if (typeof result === 'string') {
      alert(result);
      return;
    }

    const { data: { error = {} } } = result;

    // Handle any validation errors
    if (error.type === 'validation') {
      console.error('Error while capturing order! "validation":', error.message);

      if (typeof error.message === 'string') {
        alert(error.message);
        return;
      }

      error.message.forEach(({param, error}, i) => {
        this.setState({
          errors: {
            ...this.state.errors,
            [param]: error
          },
        });
      })

      errorToAlert = error.message.reduce((string, error) => {
        return `${string} ${error.error}`
      }, '');
    }

    if (error.type === 'unprocessable_entity') {
      console.error('Error while capturing order! "unprocessable_entity":', error.message);

      Object.entries(error.errors).forEach(([key, value]) => {
        const name = this.props.checkout?.live?.line_items?.find(item => key?.includes(item?.id))?.name;

        if (name) {
          errorToAlert += `${name} => ${value}\n\n`;
        }
      });

      if (!errorToAlert && error?.message) {
        errorToAlert = error.message;
      }
    }

    // Handle internal errors from the Chec API
    if (['gateway_error', 'not_valid', 'bad_request'].includes(error.type)) {
      this.setState({
        errors: {
          ...this.state.errors,
          [(error.type === 'not_valid' ? 'fulfillment[shipping_method]' : error.type)]: error.message
        },
      })
      errorToAlert = error.message
    }

    // Surface any errors to the customer
    if (errorToAlert) {
      alert(errorToAlert);
    }
  };

  captureOrder(e) {
    e.preventDefault();

    // reset error states
    this.setState({
      errors: {
        'fulfillment[shipping_method]': null,
        gateway_error: null,
        'shipping[name]': null,
        'shipping[street]': null,
      },
    });

    // set up line_items object and inner variant group object for order object below
    const line_items = this.props.checkout.live.line_items.reduce((obj, lineItem) => {
      const variantGroups = lineItem.selected_options.reduce((obj, option) => {
        obj[option.group_id] = option.option_id;
        return obj;
      }, {});
      obj[lineItem.id] = { ...lineItem, variantGroups };
      return obj;
    }, {});

    const shippingAddress = {
      name: this.state['shipping[name]'],
      country: this.state['shipping[country]'],
      street: this.state['shipping[street]'],
      street_2: this.state['shipping[street_2]'],
      town_city: this.state['shipping[town_city]'],
      county_state: this.state['shipping[region]'],
      postal_zip_code: this.state['shipping[postal_zip_code]']
    }

    // construct order object
    const newOrder = {
      line_items,
      customer: {
        firstname: this.state['customer[first_name]'],
        lastname: this.state['customer[last_name]'],
        email: this.state['customer[email]'],
        phone: this.state['customer[phone]'] || undefined
      },
      // collected 'order notes' data for extra field configured in the Chec Dashboard
      extrafields: {
        extr_j0YnEoqOPle7P6: this.state.orderNotes,
      },
      // Add more to the billing object if you're collecting a billing address in the
      // checkout form. This is just sending the name as a minimum.
      billing: this.state.selectedBillingOption === 'same' ? shippingAddress : {
        name: this.state['billing[name]'],
        country: this.state['billing[country]'],
        street: this.state['billing[street]'],
        street_2: this.state['billing[street_2]'],
        town_city: this.state['billing[town_city]'],
        county_state: this.state['billing[region]'],
        postal_zip_code: this.state['billing[postal_zip_code]']
      },
      shipping: shippingAddress,
      fulfillment: {
        shipping_method: this.state['fulfillment[shipping_method]']
      },
      payment: {
        gateway: this.state.selectedGateway,
      },
    }

    // If test gateway selected add necessary card data for the order to be completed.
    if (this.state.selectedGateway === 'test_gateway') {
      this.setState({
        loading: true,
      });

      newOrder.payment.card = {
        number: this.state.cardNumber,
        expiry_month: this.state.expMonth,
        expiry_year: this.state.expYear,
        cvc: this.state.cvc,
        postal_zip_code: this.state.billingPostalZipcode,
      }
    }

    if (this.state.selectedGateway === 'manual') {
      this.setState({
        loading: true,
      });

      newOrder.payment.gateway = 'manual';
      newOrder.payment.manual = {
        id: this.props.checkout.gateways.manual[0].id,
      };
    }

    // If Stripe gateway is selected, register a payment method, call checkout.capture(),
    // and catch errors that indicate Strong Customer Authentication is required. In this
    // case we allow Stripe.js to handle this verification, then re-submit
    // `checkout.capture()` using the payment method ID or payment intent ID returned at
    // each step.
    if (this.state.selectedGateway === 'stripe') {
      // Create a new Payment Method in Stripe.js
      return this.getStripePaymentMethod(newOrder);
    }

    if (this.state.selectedGateway === 'paypal') {
      return this.getPaypalPaymentId(newOrder);
    }

    console.log('still capturing order')
    // Capture the order
    this.props.dispatchCaptureOrder(this.props.checkout.id, newOrder)
      .then(this.handleCaptureSuccess)
      .catch((error) => {
        console.log('# ERROR 3', error)
        return this.handleCaptureError(error)
      });
  }

  async getStripePaymentMethod(newOrder) {
    return this.props.stripe.createPaymentMethod({
      type: 'card',
      card: this.props.elements.getElement(CardElement),
    })
      .then((response) => {
        // Check for errors from using Stripe.js, surface to the customer if found
        if (response.error) {
          this.handleCaptureError(response.error.message);
          return;
        }

        // Enable loading state now that we're finished interacting with Elements
        this.setState({
          loading: true,
        });

        // Get the payment method ID and continue with the capture request
        this.props.dispatchCaptureOrder(this.props.checkout.id, {
          ...newOrder,
          payment: {
            ...newOrder.payment,
            gateway: 'stripe',
            stripe: {
              payment_method_id: response.paymentMethod.id,
            },
          },
        })
          // If no further verification is required, go straight to the "success" handler
          .then(this.handleCaptureSuccess)
          .catch((error) => {
            // Look for "requires further verification" from the Commerce.js backend. This
            // will be surfaced as a 402 Payment Required error, with a unique type, and
            // the secret you need to continue verifying the transaction on the frontend.
            if (error.data.error.type !== 'requires_verification') {
              this.handleCaptureError(error);
              return;
            }

            this.props.stripe.handleCardAction(error.data.error.param)
              .then((result) => {
                // Check for errors from Stripe, e.g. failure to confirm verification of the
                // payment method, or the card was declined etc
                if (result.error) {
                  this.handleCaptureError(result.error.message);
                  return;
                }

                // Verification has successfully been completed. Get the payment intent ID
                // from the Stripe.js response and re-submit the Commerce.js
                // `checkout.capture()` request with it
                this.props.dispatchCaptureOrder(this.props.checkout.id, {
                  ...newOrder,
                  gateway: 'stripe',
                  payment: {
                    ...newOrder.payment,
                    stripe: {
                      payment_intent_id: result.paymentIntent.id,
                    },
                  },
                })
                  .then(this.handleCaptureSuccess)
                  .catch(this.handleCaptureError);
              });
            });
          })
      .catch(this.handleCaptureError);
  }

  // Create a function that will generate the PayPal approval URL to be called when the checkout loads.
  async getPaypalPaymentId(orderDetails) {
    const { t } = this.props;

    this.setState({
      paypalLoading: true,
    });

    // Use a checkout token ID that was generated earlier, and any order details that may have been collected on this page.
     await commerce.checkout.capture(this.props.checkout.id, {
      ...orderDetails,
      // Include PayPal action:
      payment: {
        gateway: 'paypal',
        paypal: {
          action: 'authorize',
        },
      },
    })
      .then(paypalAuth => {
        this.renderPaypalButton(orderDetails, paypalAuth);

        this.setState({
          paypalLoading: false,
        });
      })
      .catch(error => {
        console.error('Error while showing Paypal button', error.message);

        alert(t('error.paypalNotWorking'));

        this.setState({
          paypalLoading: false,
        });
      });
  }

  renderPaypalButton(orderDetails, paypalAuth) {
    const capturePaypalOrder = this.capturePaypalOrder;

    // @ts-ignore
    paypal.Button.render({
      env: 'production', // Or 'sandbox',
      commit: true, // Show a 'Pay Now' button
      style: {
        label: 'paypal',
        tagline: false,
        color: 'gold',
        size: 'medium',
        shape: 'rect',
      },
      payment: function() {
        return paypalAuth.payment_id // The payment ID from earlier
      },
      onAuthorize: function(paypalData, actions) {
        // Handler if customer DOES authorize payment (this is where you get the payment_id & payer_id you need to pass to Chec)
        capturePaypalOrder(orderDetails, paypalData);
      },
      onCancel: function(data, actions) {
        // Handler if customer does not authorize payment
      }
    },
    '.paypal-button-container'
    );
  }

  // Create a function that can be called when the PayPal payment has been authorized.
  async capturePaypalOrder(orderDetails, paypalData) {
    // Enable loading state now that we're finished interacting with Paypal button
    this.setState({
      loading: true,
    });

    await this.props.dispatchCaptureOrder(this.props.checkout.id, {
      ...orderDetails,
      // We have now changed the action to "capture" as well as included the "payment_id and "payer_id"
      payment: {
        gateway: 'paypal',
        paypal: {
          action: 'capture',
          payment_id: paypalData.paymentID,
          payer_id: paypalData.payerID,
        },
      },
    })
      .then(this.handleCaptureSuccess)
      .catch(this.handleCaptureError);
  }

  toggleNewsletter() {
    this.setState({
      receiveNewsletter: !this.state.receiveNewsletter,
    });
  }

  /**
   * Renders payment methods and payment information
   *
   * @returns {JSX.Element}
   */
  renderPaymentDetails() {
    const { checkout, stripe, elements } = this.props;
    const { selectedGateway, cardNumber, expMonth, expYear, cvc } = this.state;

    return (
      <PaymentDetails
        gateways={checkout.gateways}
        onChangeGateway={this.handleGatewayChange}
        selectedGateway={selectedGateway}
        cardNumber={cardNumber}
        expMonth={expMonth}
        expYear={expYear}
        cvc={cvc}
        stripe={stripe}
        elements={elements}
      />
    );
  }

  render() {
    const { paypalLoading } = this.state;
    const { checkout, shippingOptions, t } = this.props;
    const selectedShippingOption = shippingOptions.find(({id}) => id === this.state['fulfillment[shipping_method]']);

    const billingOptions = [{
      label: t('checkout.billing.options.same'),
      value: 'same',
    }, {
      label: t('checkout.billing.options.different'),
      value: 'different',
    }];

    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <Root>
        <Head>
          <title>{t('routes.checkout')} | {siteConfig.title}</title>
        </Head>

        <Script
          src="https://www.paypalobjects.com/api/checkout.js"
        />

        <div className="custom-container py-5 my-4 my-sm-5">
          {/* Row */}
          <div className="row mt-4">
            <div className="col-12 col-md-10 col-lg-6 offset-md-1 offset-lg-0">
              {/* Breadcrumbs */}
              <div className="d-flex pb-4 breadcrumb-container">
                <Link href="/collection">
                  <a className="font-color-dark font-size-caption text-decoration-underline cursor-pointer">
                    {t('routes.shop')}
                  </a>
                </Link>
                <svg className="fill-black w-16 h-16 mx-1">
                  <title>Breadcrumb arrow</title>
                  <use xlinkHref="/icons.svg#arrow-right"></use>
                </svg>
                <div className="font-size-caption font-weight-bold cursor-pointer">
                  {t('routes.checkout')}
                </div>
              </div>
              {
                checkout && (
                  <form onChange={this.handleChangeForm} onSubmit={this.captureOrder}>
                    {/* <p className="font-size-subheader font-weight-semibold mb-4">
                      {t('checkout.customer.title')}
                    </p> */}
                    <div className="row">
                      <div className="col-12 col-sm-6 mb-3">
                        <label className="w-100">
                          <p className="mb-1 font-size-caption font-color-light">
                            {t('checkout.customer.firstName')}*
                          </p>
                          <input required name="customer[first_name]" autoComplete="given-name" defaultValue={this.state['customer[first_name]']} className="rounded-0 w-100" />
                        </label>
                      </div>
                      <div className="col-12 col-sm-6 mb-3">
                        <label className="w-100">
                          <p className="mb-1 font-size-caption font-color-light">
                            {t('checkout.customer.lastName')}*
                          </p>
                          <input required name="customer[last_name]" autoComplete="family-name" defaultValue={this.state['customer[last_name]']} className="rounded-0 w-100" />
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 mb-3">
                        <label className="w-100">
                          <p className="mb-1 font-size-caption font-color-light">
                            {t('checkout.customer.phone')}
                          </p>
                          <input
                            name="customer[phone]"
                            autoComplete="tel"
                            defaultValue={this.state['customer[phone]']}
                            className="rounded-0 w-100"
                          />
                        </label>
                      </div>
                      <div className="col-12 col-sm-6 mb-3">
                        <label className="w-100">
                          <p className="mb-1 font-size-caption font-color-light">
                            {t('checkout.customer.emailAddress')}*
                          </p>
                          <input
                            required
                            name="customer[email]"
                            autoComplete="email"
                            defaultValue={this.state['customer[email]']}
                            className="rounded-0 w-100"
                          />
                        </label>
                      </div>
                    </div>
                    <p className="font-size-subheader font-weight-semibold my-4">
                     {t('checkout.shipping.title')}
                    </p>
                    <div className="mb-5">
                      <AddressForm
                        type="shipping"
                        countries={this.state.countries}
                        name={this.state['shipping[name]']}
                        country={ this.state['shipping[country]']}
                        region={this.state['shipping[region]']}
                        street={this.state['shipping[street]']}
                        street2={this.state['shipping[street_2]']}
                        townCity={this.state['shipping[town_city]']}
                        postalZipCode={this.state['shipping[postal_zip_code]']}
                      />
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="w-100">
                            <p className="mb-1 font-size-caption font-color-light">
                              {t('checkout.shipping.method')}*
                            </p>
                            <Dropdown
                              name="fulfillment[shipping_method]"
                              value={
                                selectedShippingOption
                                ? (`${selectedShippingOption.description} - ${selectedShippingOption.price.formatted_with_code}`)
                                : ''
                              }
                              placeholder={t('checkout.shipping.selectPlaceholder')}
                            >
                              {
                                shippingOptions && shippingOptions.map(option => (
                                  <option key={option.id} value={option.id}>
                                  { `${option.description} - ${option.price.formatted_with_code}` }
                                  </option>
                                ))
                              }
                            </Dropdown>
                          </label>
                        </div>
                      </div>
                      <div
                        onClick={this.toggleNewsletter}
                        className="d-flex mb-4 flex-nowrap cursor-pointer align-items-center"
                      >
                        <Checkbox
                          onClick={this.toggleNewsletter}
                          checked={this.state.receiveNewsletter}
                          className="mr-3"
                        />
                        <p>
                          {t('checkout.subscribeToNewsletter')}
                        </p>
                      </div>
                      <label className="w-100 mb-3">
                        <p className="mb-1 font-size-caption font-color-light">
                          {t('checkout.orderNotes')}
                        </p>
                        <textarea name="orderNotes" defaultValue={this.state.orderNotes} className="rounded-0 w-100" />
                      </label>
                    </div>

                    { this.renderPaymentDetails() }

                    {/* Billing Address */}
                    { checkout.collects && checkout.collects.billing_address && <>
                      <p className="font-size-subheader font-weight-semibold mb-3">
                        {t('checkout.billing.title')}
                      </p>
                      <div className="border border-color-gray400 mb-5">
                        {billingOptions.map(({ label, value }, index) => (
                          <label
                            key={index}
                            onClick={() => this.setState({ selectedBillingOption: value })}
                            className={`p-3 d-flex align-items-center cursor-pointer ${index !==
                              billingOptions.length - 1 && 'borderbottom border-color-gray500'}`}
                          >
                            <Radiobox
                              checked={this.state.selectedBillingOption === value}
                              onClick={() => this.setState({ selectedValue: value })}
                              className="mr-3"
                            />
                            <p className="font-weight-medium">
                              {label}
                            </p>
                          </label>
                        ))}
                      </div>
                      {this.state.selectedBillingOption === 'different' && (
                        <AddressForm
                          type="billing"
                          countries={this.state.countries}
                          name={this.state['billing[name]']}
                          country={ this.state['billing[country]']}
                          region={this.state['billing[region]']}
                          street={this.state['billing[street]']}
                          street2={this.state['billing[street_2]']}
                          townCity={this.state['billing[town_city]']}
                          postalZipCode={this.state['billing[postal_zip_code]']}
                        />
                      )}
                    </>}

                    <p className="checkout-error">
                      { !selectedShippingOption ? t('checkout.shipping.selectError') : '' }
                    </p>
                    <button
                      type="submit"
                      className={`bg-brand700 font-color-white w-100 border-none h-56 font-weight-semibold d-lg-block ${paypalLoading ? 'spinner' : ''}`}
                      disabled={!selectedShippingOption}
                    >
                      <div>{t('checkout.payment.cta')}</div>
                    </button>
                    <div className="paypal-button-container mt-4 text-center"></div>
                  </form>
                )
              }
            </div>

            <div className="col-12 col-lg-5 col-md-10 offset-md-1 mt-4 mt-lg-0">
              <div className="bg-brand200 p-lg-5 p-3 checkout-summary">
                <div className="borderbottom font-size-subheader border-color-gray400 pb-2 font-weight-medium">
                  {t('checkout.order.title')}
                </div>
                <div className="pt-3 borderbottom border-color-gray400">
                  {(checkout.live ? checkout.live.line_items : []).map((item, index, items) => {
                    return (
                      <div
                        key={item.id}
                        className="d-flex mb-2"
                      >
                        {(item && item.media) && (
                          <Link href={`/product/${item.permalink}`}>
                            <a className="cursor-pointer">
                              <Image
                                src={item.media.source}
                                className="checkout__line-item-image mr-2"
                                alt={item.product_name}
                                width={80}
                                height={80}
                                objectFit='contain'
                              />
                            </a>
                          </Link>
                        )}
                        <div className="d-flex flex-grow-1">
                          <div className="flex-grow-1 flex-shrink-1">
                            <Link href={`/product/${item.permalink}`}>
                              <a className="cursor-pointer">
                                <p className="font-weight-medium font-color-black">
                                  {item.product_name}
                                </p>
                              </a>
                            </Link>
                            <p className="font-color-light">
                              {t('checkout.order.quantity')}: {item.quantity}
                            </p>
                            <div className="d-flex justify-content-between mb-2">
                              {item.selected_options.map((option) =>
                                <p key={option.group_id} className="font-color-light font-weight-small">
                                  {option.group_name}: {option.option_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right font-weight-semibold flex-grow-0 flex-shrink-0 ml-2">
                            {item.line_total.formatted_with_code}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="row py-3 borderbottom border-color-gray400">
                  <input
                    name="discountCode"
                    onChange={this.handleChangeForm}
                    defaultValue={this.state.discountCode}
                    placeholder={t('checkout.order.discountPlaceholder')}
                    className="mr-2 col"
                  />
                  <button
                    className="font-color-white border-none font-weight-medium px-4 col-auto"
                    disabled={!this.props.checkout || undefined}
                    onClick={this.handleDiscountChange}
                  >
                    {t('common.apply')}
                  </button>
                </div>
                <div className="py-3 borderbottom border-color-black">
                  {[
                    {
                      name: t('checkout.order.subtotal'),
                      amount: checkout.live ? checkout.live.subtotal.formatted_with_code : '',
                    },
                    {
                      name: t('checkout.order.tax'),
                      amount: checkout.live ? checkout.live.tax.amount.formatted_with_code : '',
                    },
                    {
                      name: t('checkout.order.shipping'),
                      amount: selectedShippingOption
                        ? `${selectedShippingOption.description} - ${selectedShippingOption.price.formatted_with_code}`
                        : t('checkout.order.shippingNotSelected'),
                    },
                    {
                      name: t('checkout.order.discount'),
                      amount: (checkout.live && checkout.live.discount && checkout.live.discount.code)
                        ? t('checkout.order.discountSaved') + ` ${checkout.live.discount.amount_saved.formatted_with_code}`
                        : t('checkout.order.discountNotSelected'),
                    }
                  ].map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                      <p>{item.name}</p>
                      <p className="text-right font-weight-medium">
                        {item.amount}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                  <p className="font-size-title font-weight-semibold">
                    {t('checkout.order.totalAmount')}
                  </p>
                  <p className="text-right font-weight-semibold font-size-title">
                    { checkout.live ? checkout.live.total.formatted_with_code : '' }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Root>
    );
  }
}

CheckoutPage.propTypes = {
  orderReceipt: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  checkout: PropTypes.object,
  cart: PropTypes.object,
  shippingOptions: PropTypes.array,
  dispatchGenerateCheckout: PropTypes.func,
  dispatchGetShippingOptions: PropTypes.func,
  dispatchSetDiscountCodeInCheckout: PropTypes.func,
}

// If using Stripe, this provides context to the page so we can use `stripe` and
// `elements` as props.
const InjectedCheckoutPage = (passProps) => {
  return (
    <Elements stripe={passProps.stripe}>
      <ElementsConsumer>
        { ({ elements, stripe }) => (
          <CheckoutPage {...passProps} stripe={stripe} elements={elements} />
        ) }
      </ElementsConsumer>
    </Elements>
  );
};

export default withRouter(
  connect(
    ({ checkout: { checkoutTokenObject, shippingOptions }, cart, customer, orderReceipt }) => ({
      checkout: checkoutTokenObject,
      customer,
      shippingOptions,
      cart,
      orderReceipt,
    }),
    {
      dispatchGenerateCheckout,
      dispatchGetShippingOptions,
      dispatchSetShippingOptionsInCheckout,
      dispatchSetDiscountCodeInCheckout,
      dispatchCaptureOrder,
    },
  )(withTranslation()(InjectedCheckoutPage)),
);

/**
 * Fetch all available countries for shipping
 */
async function getAllCountries(checkout) {
  const countries = commerce.services.localeListShippingCountries(checkout.id)
    .then(data => data.countries)
    .catch(error => console.log(error));

  return countries || {};
}
