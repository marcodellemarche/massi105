import React, { Component } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import Radiobox from '../../common/atoms/Radiobox';
import { withTranslation } from 'react-i18next';
import siteConfig from '../../../utils/siteConfig.js';

class PaymentDetails extends Component {
  /**
   * Render a form for using the Chec test gateway.
   *
   * @returns {JSX.Element}
   */
  renderTestGateway() {
    const {
      gateways,
      onChangeGateway,
      selectedGateway,
      cardNumber,
      expMonth,
      expYear,
      cvc,
      t,
    } = this.props;

    if (!gateways || !gateways.available['test_gateway']) {
      return null;
    }

    return (
      <div className="borderbottom border-color-gray500">
        <label
          onClick={() => onChangeGateway('test_gateway')}
          className="p-3 d-flex align-items-center cursor-pointer"
        >
          <Radiobox
            checked={selectedGateway === 'test_gateway'}
            className="mr-3"
          />
          <p className="font-weight-medium">
            {t('checkout.payment.testGateway')}
          </p>
        </label>

        { selectedGateway === 'test_gateway' && (
          <div className="pl-5 pr-3 pb-3 ml-2">
            <div className="row">
              <div className="col-sm-8">
                <label className="w-100 mb-3 mt-2 mb-sm-0">
                  <p className="mb-1 font-size-caption font-color-light">
                    {t('checkout.payment.cardNumber')}
                  </p>
                  <input
                    name="cardNumber"
                    pattern="[0-9. ]+"
                    defaultValue={cardNumber}
                    maxLength={16}
                    className="rounded-0 w-100"
                  />
                </label>
              </div>
              <div className="col-sm-3">
                <label className="w-100 mb-3 mt-2 mb-sm-0">
                  <p className="mb-1 font-size-caption font-color-light">
                    {t('checkout.payment.cvc')}
                  </p>
                  <input
                    name="cvc"
                    defaultValue={cvc}
                    maxLength={3}
                    type="number"
                    className="rounded-0 w-100"
                  />
                </label>
              </div>
              <div className="col-sm-3">
                <label className="w-100 mb-3 mt-2 mb-sm-0">
                  <p className="mb-1 font-size-caption font-color-light">
                    {t('checkout.payment.expireMonth')}
                  </p>
                  <input
                    name="expMonth"
                    type="number"
                    defaultValue={expMonth}
                    className="rounded-0 w-100"
                    placeholder="MM"
                  />
                </label>
              </div>
              <div className="col-sm-3">
                <label className="w-100 mb-3 mt-2 mb-sm-0">
                  <p className="mb-1 font-size-caption font-color-light">
                    {t('checkout.payment.expireYear')}
                  </p>
                  <input
                    type="number"
                    name="expYear"
                    defaultValue={expYear}
                    className="rounded-0 w-100"
                    placeholder="YY"
                  />
                </label>
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }

  /**
   * Render a form for using the manual payment.
   *
   * @returns {JSX.Element}
   */
   renderManualGateway() {
    const {
      gateways,
      onChangeGateway,
      selectedGateway,
      cardNumber,
      expMonth,
      expYear,
      cvc,
      t,
    } = this.props;

    if (!gateways || !gateways.available['manual']) {
      return null;
    }

    return (
      <div className="borderbottom border-color-gray500">
        <label
          onClick={() => onChangeGateway('manual')}
          className="p-3 d-flex align-items-center cursor-pointer"
        >
          <Radiobox
            checked={selectedGateway === 'manual'}
            className="mr-3"
          />
          <p className="font-weight-medium">
            {t('checkout.payment.manual')}
          </p>
        </label>

        { selectedGateway === 'manual' && (
          <div className="pl-5 pr-3 pb-3 ml-2">
            {t('checkout.payment.manualDetails')}
          </div>
        ) }
      </div>
    );
  }

  /**
   * Renders a Stripe Elements form for capturing payment information using Stripe as the gateway
   *
   * @returns {JSX.Element}
   */
  renderStripe() {
    const { gateways, onChangeGateway, selectedGateway, t } = this.props;

    if (!gateways || !gateways.available['stripe']) {
      return null;
    }

    const cardElementOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      }
    }

    return (
      <div className="borderbottom border-color-gray500">
        <label
          onClick={() => onChangeGateway('stripe')}
          className="p-3 d-flex align-items-center cursor-pointer"
        >
          <Radiobox
            checked={selectedGateway === 'stripe'}
            className="mr-3"
          />
          <p className="font-weight-medium">
            {t('checkout.payment.stripe')}
          </p>
        </label>

        { selectedGateway === 'stripe' && (
          <div className="pl-5 pr-3 pb-3 ml-2">
            <CardElement options={cardElementOptions} />
          </div>
        ) }
      </div>
    );
  }

  /**
   * Renders a Paypal element for capturing payment information using Stripe as the gateway
   *
   * @returns {JSX.Element}
   */
   renderPaypal() {
    const { gateways, onChangeGateway, selectedGateway, t } = this.props;

    if (!gateways || !gateways.available['paypal']) {
      return null;
    }

    return (
      <div className="borderbottom border-color-gray500">
        <label
          onClick={() => onChangeGateway('paypal')}
          className="p-3 d-flex align-items-center cursor-pointer"
        >
          <Radiobox
            checked={selectedGateway === 'paypal'}
            className="mr-3"
          />
          <p className="font-weight-medium">
            {t('checkout.payment.paypal')}
          </p>
        </label>

        { selectedGateway === 'paypal' && (
          <div className="pl-5 pr-3 pb-3 ml-2">
            {t('checkout.payment.paypalDetails')}
          </div>
        ) }
      </div>
    );
  }

  /**
   * Render the payment view, including payment options for each supported gateway
   *
   * @returns {JSX.Element}
   */
  render() {
    const { t } = this.props;

    return (
      <>
        <p className="font-size-subheader font-weight-semibold mb-3">
          {t('checkout.payment.title')}
        </p>
        <div className="border border-color-gray400 mb-5">
          {/* { this.renderTestGateway() } */}
          {/* { this.renderStripe() } */}
          { this.renderPaypal() }
          { this.renderManualGateway() }
          { /* todo support other gateways here */ }
        </div>
      </>
    );
  }
}

PaymentDetails.propTypes = {
  gateways: PropTypes.object,
  onChangeGateway: PropTypes.func,
  selectedGateway: PropTypes.string,
}

export default withTranslation()(PaymentDetails);
